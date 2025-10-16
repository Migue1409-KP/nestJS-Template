// users.controller.ts
import { Controller, Post, Body, UseGuards, HttpCode, Patch, Param, Get } from '@nestjs/common';
import { AuthGuard, Session, UserSession } from '@thallesp/nestjs-better-auth';
import { UsersService } from '../services/users.service';
import { ZodValidationPipe } from '@/shared/pipes/zod-validation.pipe';
import { CreateUserProfileDto, CreateUserProfileSchema, CreateUserProfileSwaggerDto } from '../dto/create-user.dto';
import { UpdateUserProfileDto, UpdatePartialUserProfileSchema, UpdatePartialUserProfileSwaggerDto } from '../dto/update-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { ApiSuccess } from '@/shared/interfaces/api-response';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('profile')
  @HttpCode(201)
  @ApiSecurity('cookieAuth')
  @ApiOperation({ summary: 'Create user profile of authenticated user' })
  @ApiResponse({ status: 201, description: 'User profile created successfully.' })
  @ApiBody({ type: CreateUserProfileSwaggerDto })
  async createProfile(
    @Session() session: UserSession,
    @Body(new ZodValidationPipe(CreateUserProfileSchema)) body: CreateUserProfileDto,
  ): Promise<ApiSuccess<CreateUserProfileDto>> {
    const authUserId = session.user.id;
    return {
      status: "success",
      data: await this.usersService.createProfile({ authUserId: authUserId, ...body }),
    };
  }

  @Patch('profile/:id')
  @ApiSecurity('cookieAuth')
  @ApiOperation({ summary: 'Update user profile by ID' })
  @ApiResponse({ status: 200, description: 'User profile updated successfully.' })
  @ApiResponse({ status: 404, description: 'User profile not found.' })
  @ApiBody({ type: UpdatePartialUserProfileSwaggerDto })
  async updateProfile(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdatePartialUserProfileSchema)) body: UpdateUserProfileDto,
  ): Promise<ApiSuccess<any>> {
    return {
      status: "success",
      data: await this.usersService.updateProfile(id as any, body),
    };
  }

  @Get('profile/:id')
  @ApiSecurity('cookieAuth')
  @ApiOperation({ summary: 'Get user profile by ID' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'User profile not found.' })
  async getProfileById(@Param('id') id: string): Promise<ApiSuccess<any>> {
    return {
      status: "success",
      data: await this.usersService.findProfileById(id as any),
    };
  }

  @Get('profile-exists')
  @ApiSecurity('cookieAuth')
  @ApiOperation({ summary: 'Check if authenticated user has a profile' })
  @ApiResponse({ status: 200, description: 'Profile existence checked.' })
  async checkProfileExists(@Session() session: UserSession): Promise<ApiSuccess<{ hasProfile: boolean }>> {
    const hasProfile = await this.usersService.checkProfileExists(session.user.id);
    return {
      status: "success",
      data: { hasProfile },
    };
  }
}
