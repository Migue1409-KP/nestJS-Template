import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { AuthConfigModule } from './providers/auth-config.module';
import { AuthConfigFactory } from './providers/auth-config.factory';
import { AuthService } from './auth.service';
import { UserRepository } from '@/users/repositories/user-profiles.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from '@/users/entities/user-profiles.entity';
import { HttpModule } from '@/core/http/http.module';

@Module({
  imports: [
    AuthConfigModule,
    HttpModule,
    TypeOrmModule.forFeature([UserProfile]),
    BetterAuthModule.forRootAsync({
      imports: [AuthConfigModule],
      inject: [AuthConfigFactory],
      useFactory: (factory: AuthConfigFactory) => ({
        auth: factory.create(),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository],
  exports: [AuthService],
})
export class AuthModule {}
