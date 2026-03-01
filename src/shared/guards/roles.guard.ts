// src/shared/guards/roles.guard.ts
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@/shared/decorators/roles.decorator';
import { ExtendedUserSession } from '../interfaces/extended-session';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const session: ExtendedUserSession = request.user ?? request.session;

    if (!session?.user?.role) {
      throw new ForbiddenException('Missing user role');
    }

    const hasRole = requiredRoles.includes(session.user.role);
    if (!hasRole) {
      throw new ForbiddenException('Access denied for user role');
    }

    return true;
  }
}
