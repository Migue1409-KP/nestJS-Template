import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '@/users/users.module';
import { AuthConfigFactory } from './auth-config.factory';

@Module({
  imports: [ConfigModule, UsersModule],
  providers: [AuthConfigFactory],
  exports: [AuthConfigFactory],
})
export class AuthConfigModule {}