import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { fromNodeHeaders } from 'better-auth/node';
import { ALLOW_ANONYMOUS_KEY } from '@/shared/decorators/allow-anonymous.decorator';
import { OPTIONAL_AUTH_KEY } from '@/shared/decorators/optional-auth.decorator';
import { PolicyService } from '@/shared/authorization/services/policy.service';
import { ExtendedUserSession } from '@/shared/interfaces/extended-session';

export const AUTH_CLIENT_SERVICE = Symbol('AUTH_CLIENT_SERVICE');

export interface IAuthClientService {
  instance: {
    api: {
      getSession(args: { headers: Headers }): Promise<ExtendedUserSession | null>;
    };
  };
}

@Injectable()
export class PolicyGuard implements CanActivate {
  private readonly logger = new Logger(PolicyGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly policy: PolicyService,
    private readonly config: ConfigService,
    @Inject(AUTH_CLIENT_SERVICE) private readonly betterAuth: IAuthClientService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();

    // Single session fetch per request — result is cached on req so downstream
    // decorators like @Session() work correctly on both public and protected routes.
    if (!req.session) {
      const session = (await this.betterAuth.instance.api.getSession({
        headers: fromNodeHeaders(req.headers),
      })) as ExtendedUserSession | null;
      req.session = session;
      req.user = session?.user ?? null;
    }

    // Routes marked @AllowAnonymous or @OptionalAuth bypass authorization.
    // Keys are project-owned — independent of the library's internal keys.
    const isAnonymous = this.reflector.getAllAndOverride<boolean>(ALLOW_ANONYMOUS_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    const isOptional = this.reflector.getAllAndOverride<boolean>(OPTIONAL_AUTH_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isAnonymous || isOptional) return true;

    const session: ExtendedUserSession | null = req.session;

    if (!session) {
      throw new UnauthorizedException('Authentication required');
    }

    const roles = session.user?.roles ?? [];

    if (roles.length === 0) {
      throw new ForbiddenException('Access denied');
    }

    // Strip the global prefix from the registered route pattern to get the resource key.
    const prefix = this.config.get<string>('API_PREFIX', 'api/v1');
    const rawPath: string = req.route?.path ?? req.path ?? '';
    const resource = rawPath.replace(new RegExp(`^/?${prefix}/?`), '').replace(/^\/+/, '');

    const method = (req.method as string).toUpperCase();

    if (!this.policy.isAllowed(roles, resource, method)) {
      this.logger.warn(
        `Access denied: userId=${session.user.id} roles=[${roles.join(',')}] ${method} ${resource}`,
      );
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
