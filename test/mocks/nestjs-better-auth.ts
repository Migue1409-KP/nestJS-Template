/**
 * Jest manual mock for @thallesp/nestjs-better-auth.
 * The library's CJS build transitively requires ESM-only packages (@noble/ciphers,
 * jose) that Jest's default CJS loader cannot parse. This mock provides no-op
 * stubs for all the library exports used in the project's source files so that
 * every unit-test suite that imports from the shared decorators barrel (or any
 * other file that pulls in the library) does not trigger the ESM chain.
 *
 * Note: Node.js v20.19+ supports require(esm) natively, but Jest's own module
 * loader does not, which is why this workaround is needed.
 */

import { SetMetadata } from '@nestjs/common';

export const AllowAnonymous = () => SetMetadata('PUBLIC', true);
export const OptionalAuth = () => SetMetadata('OPTIONAL', true);
export const Public = AllowAnonymous;
export const Optional = OptionalAuth;
export const Roles = (roles: string[]) => SetMetadata('ROLES', roles);
export const Session = () => () => {};
export const BeforeHook = (_path?: string) => SetMetadata('BEFORE_HOOK', _path);
export const AfterHook = (_path?: string) => SetMetadata('AFTER_HOOK', _path);
export const Hook = () => () => {};

export class AuthService {
  get api() {
    return undefined;
  }
  get instance() {
    return undefined;
  }
}
export class AuthGuard {
  canActivate() {
    return true;
  }
}
export class AuthModule {
  static forRoot() {
    return { module: AuthModule };
  }
  static forRootAsync() {
    return { module: AuthModule };
  }
}

export const BEFORE_HOOK_KEY = Symbol('BEFORE_HOOK');
export const AFTER_HOOK_KEY = Symbol('AFTER_HOOK');
export const HOOK_KEY = Symbol('HOOK');
export const AUTH_MODULE_OPTIONS_KEY = Symbol('AUTH_MODULE_OPTIONS');
