import { UserSession as BaseUserSession } from '@thallesp/nestjs-better-auth';
import { Role } from '@/shared/authorization/constants/roles.constant';

export interface ExtendedUserSession extends BaseUserSession {
  user: BaseUserSession['user'] & {
    roles: Role[];
  };
}
