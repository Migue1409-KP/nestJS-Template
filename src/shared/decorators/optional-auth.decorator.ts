import { applyDecorators, SetMetadata } from '@nestjs/common';
import { OptionalAuth as LibOptionalAuth } from '@thallesp/nestjs-better-auth';

export const OPTIONAL_AUTH_KEY = 'app:authz:optional-auth';

export const OptionalAuth = (): MethodDecorator & ClassDecorator =>
  applyDecorators(LibOptionalAuth(), SetMetadata(OPTIONAL_AUTH_KEY, true)) as MethodDecorator &
    ClassDecorator;
