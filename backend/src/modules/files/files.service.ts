import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { LocalStorage } from './storage/local.storage.js';
import { S3Storage } from './storage/s3.storage.js';
import { R2Storage } from './storage/r2.storage.js';
import { FileUploadDto } from './dto/file-upload.dto.js';

// Req 24: File storage with multiple backends
@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  constructor(
    private prisma: PrismaService,
    private localStorage: LocalStorage,
    private s3Storage: S3Storage,
    private r2Storage: R2Storage,
  ) {}

  async upload(dto: FileUploadDto, buffer: Buffer, userId: string) {
    // Validate file size
    if (buffer.length > this.MAX_FILE_SIZE) {
      throw new BadRequestException('File size exceeds maximum allowed size');
    }

    // Validate file type
    if (!this.ALLOWED_TYPES.includes(dto.mimetype)) {
      throw new BadRequestException('File type not allowed');
    }

    const storage = this.getStorage(dto.storage || 'local');
    const storageKey = await storage.upload(dto.filename, buffer, dto.mimetype);

    const file = await this.prisma.file.create({
      data: {
        filename: dto.filename,
        original_name: dto.originalName || dto.filename,
        mime_type: dto.mimetype,
        size: buffer.length,
        storage_key: storageKey,
        storage_type: dto.storage || 'local',
        user_id: userId,
        is_temporary: dto.isTemporary || false,
      },
    });

    this.logger.log(`File uploaded: ${file.id} by user ${userId}`);

    return file;
  }

  async findOne(id: string) {
    const file = await this.prisma.file.findUnique({
      where: { id, deleted_at: null },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  async delete(id: string, userId: string) {
    const file = await this.findOne(id);

    if (file.user_id !== userId) {
      throw new BadRequestException('Unauthorized to delete this file');
    }

    const storage = this.getStorage(file.storage_type);
    await storage.delete(file.storage_key);

    return this.prisma.file.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }

  async getMetadata(id: string) {
    return this.findOne(id);
  }

  async getTemporaryUrl(id: string, expiresIn = 3600) {
    const file = await this.findOne(id);
    const storage = this.getStorage(file.storage_type);
    return storage.getSignedUrl(file.storage_key, expiresIn);
  }

  private getStorage(provider: string) {
    switch (provider) {
      case 'local':
        return this.localStorage;
      case 's3':
        return this.s3Storage;
      case 'r2':
        return this.r2Storage;
      default:
        throw new BadRequestException(`Unknown storage provider: ${provider}`);
    }
  }
}
