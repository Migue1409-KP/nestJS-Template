import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { NotificationModule } from './notification/notification.module';
import { HttpModule } from './http/http.module';
import { ParametersModule } from './parameters/parameters.module';
import { StorageModule } from './storage/storage.module';

@Global()
@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    NotificationModule,
    HttpModule,
    ParametersModule,
    StorageModule,
  ],
  exports: [DatabaseModule, NotificationModule, HttpModule, ParametersModule, StorageModule],
})
export class CoreModule {}
