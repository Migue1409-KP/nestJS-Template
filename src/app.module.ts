import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { CoreModule } from '@/core/core.module';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import { winstonConfig } from '@/core/config/winston.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    WinstonModule.forRootAsync({
      useFactory: winstonConfig,
      inject: [ConfigService],
    }),
    CoreModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
