// Prevent loading ESM-only packages (@noble/ciphers, jose) pulled in by better-auth.
jest.mock('@thallesp/nestjs-better-auth', () => ({
  AllowAnonymous: () => () => {},
  OptionalAuth: () => () => {},
}));
jest.mock('better-auth/node', () => ({
  fromNodeHeaders: () => new Headers(),
}));

import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PolicyGuard, AUTH_CLIENT_SERVICE } from './policy.guard';
import { PolicyService } from '@/shared/authorization/services/policy.service';
import { ALLOW_ANONYMOUS_KEY } from '@/shared/decorators/allow-anonymous.decorator';
import { OPTIONAL_AUTH_KEY } from '@/shared/decorators/optional-auth.decorator';

const mockPolicyService = {
  isAllowed: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue('api/v1'),
};

const mockBetterAuthService = {
  instance: {
    api: {
      getSession: jest.fn(),
    },
  },
};

function buildContext({
  roles = ['USER'],
  sessionOnRequest = true,
  routePath = '/api/v1/users/profile',
  method = 'POST',
}: {
  roles?: string[];
  /** When false, req.session is undefined (simulates guard running before AuthGuard). */
  sessionOnRequest?: boolean;
  routePath?: string;
  method?: string;
} = {}): ExecutionContext {
  return {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({
      getRequest: () => ({
        session: sessionOnRequest && roles.length ? { user: { roles } } : undefined,
        headers: {},
        route: { path: routePath },
        method,
      }),
    }),
  } as unknown as ExecutionContext;
}

describe('PolicyGuard', () => {
  let guard: PolicyGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PolicyGuard,
        { provide: PolicyService, useValue: mockPolicyService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: AUTH_CLIENT_SERVICE, useValue: mockBetterAuthService },
        Reflector,
      ],
    }).compile();

    guard = module.get<PolicyGuard>(PolicyGuard);
    reflector = module.get<Reflector>(Reflector);
    jest.clearAllMocks();
    mockBetterAuthService.instance.api.getSession.mockResolvedValue(null);
  });

  it('allows when @AllowAnonymous is set', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === ALLOW_ANONYMOUS_KEY) return true;
      return false;
    });
    await expect(guard.canActivate(buildContext({ roles: [] }))).resolves.toBe(true);
    expect(mockPolicyService.isAllowed).not.toHaveBeenCalled();
  });

  it('allows when @OptionalAuth is set', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === OPTIONAL_AUTH_KEY) return true;
      return false;
    });
    await expect(guard.canActivate(buildContext({ roles: [] }))).resolves.toBe(true);
    expect(mockPolicyService.isAllowed).not.toHaveBeenCalled();
  });

  it('throws UnauthorizedException when no session exists', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    mockBetterAuthService.instance.api.getSession.mockResolvedValue(null);
    await expect(
      guard.canActivate(buildContext({ roles: [], sessionOnRequest: false })),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('throws ForbiddenException when session has no roles', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    mockBetterAuthService.instance.api.getSession.mockResolvedValue({ user: { roles: [] } });
    await expect(
      guard.canActivate(buildContext({ roles: [], sessionOnRequest: false })),
    ).rejects.toThrow(ForbiddenException);
  });

  it('fetches session via betterAuth when req.session is not set', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    mockBetterAuthService.instance.api.getSession.mockResolvedValue({ user: { roles: ['USER'] } });
    mockPolicyService.isAllowed.mockReturnValue(true);
    await expect(
      guard.canActivate(
        buildContext({
          roles: ['USER'],
          sessionOnRequest: false,
          routePath: '/api/v1/users/profile',
          method: 'POST',
        }),
      ),
    ).resolves.toBe(true);
    expect(mockBetterAuthService.instance.api.getSession).toHaveBeenCalled();
  });

  it('allows when PolicyService grants access', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    mockPolicyService.isAllowed.mockReturnValue(true);
    await expect(guard.canActivate(buildContext({ roles: ['USER'] }))).resolves.toBe(true);
  });

  it('throws ForbiddenException when PolicyService denies access', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    mockPolicyService.isAllowed.mockReturnValue(false);
    await expect(guard.canActivate(buildContext({ roles: ['USER'] }))).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('strips the global prefix to derive the resource key', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    mockPolicyService.isAllowed.mockReturnValue(true);
    await guard.canActivate(
      buildContext({ roles: ['USER'], routePath: '/api/v1/users/profile/:id', method: 'GET' }),
    );
    expect(mockPolicyService.isAllowed).toHaveBeenCalledWith(['USER'], 'users/profile/:id', 'GET');
  });

  it('normalises method to uppercase', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    mockPolicyService.isAllowed.mockReturnValue(true);
    await guard.canActivate(
      buildContext({ roles: ['USER'], routePath: '/api/v1/users/profile', method: 'post' }),
    );
    expect(mockPolicyService.isAllowed).toHaveBeenCalledWith(['USER'], 'users/profile', 'POST');
  });
});
