// Req 24: File Storage and Management
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { LocalStorage } from './storage/local.storage.js';
import { S3Storage } from './storage/s3.storage.js';
import { R2Storage } from './storage/r2.storage.js';
import { StorageType } from './dto/file-upload.dto.js';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/csv'];

  constructor(
    private readonly prisma: PrismaService,
    private readonly localStorage: LocalStorage,
    private readonly s3Storage: S3Storage,
    private readonly r2Storage: R2Storage,
  ) {}

  // Req 24.3: File type validation and size limits
  validateFile(filename: string, mimeType: string, size: number) {
    if (size > this.maxFileSize) {
      throw new BadRequestException(`File size exceeds ${this.maxFileSize / 1024 / 1024}MB limit`);
    }
    if (!this.allowedMimeTypes.includes(mimeType)) {
      throw new BadRequestException(`File type ${mimeType} not allowed`);
    }
  }

  // Req 24.1: Secure file upload with validation
  async upload(userId: string, filename: string, buffer: Buffer, mimeType: string, storageType: StorageType = StorageType.LOCAL, isTemporary = false) {
    this.validateFile(filename, mimeType, buffer.length);

    const uniqueFilename = `${Date.now()}-${filename}`;
    let storageKey: string;

    // Req 24.2: Multiple storage backends
    switch (storageType) {
      case StorageType.S3:
        storageKey = await this.s3Storage.save(uniqueFilename, buffer);
        break;
      case StorageType.R2:
        storageKey = await this.r2Storage.save(uniqueFilename, buffer);
        break;
      default:
        storageKey = await this.localStorage.save(uniqueFilename, buffer);
    }

    // Req 24.7: File metadata tracking
    const file = await this.prisma.file.create({
      data: {
        user_id: userId,
        filename: uniqueFilename,
        original_name: filename,
        mime_type: mimeType,
        size: buffer.length,
        storage_key: storageKey,
        storage_type: storageType,
        is_temporary: isTemporary,
        expires_at: isTemporary ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null, // 24h for temp files
      },
    });

    this.logger.log(`File uploaded: ${file.id} (${storageType})`);
    return file;
  }

  // Req 24.4: Temporary URL generation
  async getTemporaryUrl(fileId: string): Promise<string> {
    const file = await this.prisma.file.findUnique({ where: { id: fileId } });
    if (!file) throw new BadRequestException('File not found');

    if (file.storage_type === 's3') {
      return this.s3Storage.getSignedUrl(file.storage_key);
    } else if (file.storage_type === 'r2') {
      return this.r2Storage.getSignedUrl(file.storage_key);
    }
    return file.storage_key; // Local path
  }

  // Req 24.8: File cleanup and retention
  async cleanupExpiredFiles() {
    const expired = await this.prisma.file.findMany({
      where: { is_temporary: true, expires_at: { lte: new Date() } },
    });

    for (const file of expired) {
      await this.deleteFile(file.id);
    }
    this.logger.log(`Cleaned up ${expired.length} expired files`);
  }

  async deleteFile(fileId: string) {
    const file = await this.prisma.file.findUnique({ where: { id: fileId } });
    if (!file) return;

    // Delete from storage
    try {
      if (file.storage_type === 's3') {
        await this.s3Storage.delete(file.storage_key);
      } else if (file.storage_type === 'r2') {
        await this.r2Storage.delete(file.storage_key);
      } else {
        await this.localStorage.delete(file.storage_key);
      }
    } catch (error) {
      this.logger.error(`Failed to delete file from storage: ${error}`);
    }

    await this.prisma.file.update({
      where: { id: fileId },
      data: { deleted_at: new Date() },
    });
  }
}
