import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { NotificationModule } from './notification/notification.module';
import { HttpModule } from './http/http.module';
import { ParametersModule } from './parameters/parameters.module';

@Global()
@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    NotificationModule,
    HttpModule,
    ParametersModule,
  ],
  exports: [
    DatabaseModule,
    NotificationModule,
    HttpModule,
    ParametersModule,
  ],
})
export class CoreModule {}
