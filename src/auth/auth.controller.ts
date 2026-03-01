import { Controller, Get } from '@nestjs/common';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';
import { ApiTags, ApiSecurity, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ApiSuccess } from '@/shared/interfaces/api-response';

@ApiTags('Local Auth')
@Controller('local-auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @ApiSecurity('cookieAuth')
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({ status: 200, description: 'User information retrieved successfully.' })
  async getMe(@Session() session: UserSession): Promise<ApiSuccess<UserSession>> {
    return {
      status: 'success',
      data: session,
    };
  }
}
