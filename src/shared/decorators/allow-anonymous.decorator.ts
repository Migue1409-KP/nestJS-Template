import { applyDecorators, SetMetadata } from '@nestjs/common';
import { AllowAnonymous as LibAllowAnonymous } from '@thallesp/nestjs-better-auth';

export const ALLOW_ANONYMOUS_KEY = 'app:authz:allow-anonymous';

export const AllowAnonymous = (): MethodDecorator & ClassDecorator =>
  applyDecorators(LibAllowAnonymous(), SetMetadata(ALLOW_ANONYMOUS_KEY, true)) as MethodDecorator &
    ClassDecorator;
