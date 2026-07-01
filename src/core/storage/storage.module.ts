import { Module } from '@nestjs/common';
import { STORAGE_PROVIDER } from './interfaces/storage-provider.interface';
import { CloudflareR2Provider } from './providers/cloudflare-r2.provider';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';

@Module({
  controllers: [StorageController],
  providers: [StorageService, { provide: STORAGE_PROVIDER, useClass: CloudflareR2Provider }],
  exports: [StorageService],
})
export class StorageModule {}
