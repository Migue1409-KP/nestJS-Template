import { UserRepository } from '@/users/repositories/user-profiles.repository';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { auth } from './better-auth.cli';
import { UserSession } from '@thallesp/nestjs-better-auth';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private readonly http: HttpService) {}

  private async afterSignUp(
    userId: string,
    email: string,
    provider: 'email' | 'google' | 'apple',
  ) {}

  async getUserProfileByGoogleId(googleId: string) {
    try {
      const response = await firstValueFrom(
        this.http.get(
          `https://people.googleapis.com/v1/people/${googleId}?personFields=names,emailAddresses,genders,birthdays,addresses,locations,language`,
        ),
      );
      this.logger.log('Fetched user profile:', response.data);

      return response.data;
    } catch (error) {
      this.logger.error('Error fetching user profile:', error);
      throw error;
    }
  }

  private handleAuthError(status: number, message?: string): never {
    switch (status) {
      case 400:
        throw new BadRequestException(message || 'Invalid request data');
      case 401:
        throw new UnauthorizedException(message || 'Unauthorized: Invalid credentials');
      case 403:
        throw new ForbiddenException(message || 'Forbidden: Access denied');
      case 404:
        throw new NotFoundException(message || 'User or resource not found');
      case 422:
        throw new UnprocessableEntityException(
          message || 'Validation error: Please check your input',
        );
      case 429:
        throw new UnprocessableEntityException({
          statusCode: 429,
          message: message || 'Too many requests: Please try again later',
          error: 'Too Many Requests',
        });
      case 500:
        throw new InternalServerErrorException(
          message || 'Internal server error: Please try again',
        );
      default:
        throw new Error(`Unexpected error: Status ${status}`);
    }
  }
}
