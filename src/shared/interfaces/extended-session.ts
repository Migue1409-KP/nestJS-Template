import { UserSession as BaseUserSession } from '@thallesp/nestjs-better-auth';

/**
 * Extiende el UserSession base de BetterAuth para incluir el campo `role`.
 * Esto te da tipado completo y seguro para session.user.role
 */
export interface ExtendedUserSession extends BaseUserSession {
  user: BaseUserSession['user'] & {
    role: string;
  };
}