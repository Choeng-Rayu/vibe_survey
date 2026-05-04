import { Module } from '@nestjs/common';
import { FilesController } from './files.controller.js';
import { FilesService } from './files.service.js';
import { LocalStorage } from './storage/local.storage.js';
import { S3Storage } from './storage/s3.storage.js';
import { R2Storage } from './storage/r2.storage.js';
import { DatabaseModule } from '../../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  controllers: [FilesController],
  providers: [FilesService, LocalStorage, S3Storage, R2Storage],
  exports: [FilesService],
})
export class FilesModule {}
