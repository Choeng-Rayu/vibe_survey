import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

// Req 24: Local file storage provider
@Injectable()
export class LocalStorage {
  private readonly logger = new Logger(LocalStorage.name);
  private readonly uploadDir = join(process.cwd(), 'uploads');

  constructor() {
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      this.logger.error('Failed to create upload directory', error);
    }
  }

  async upload(filename: string, buffer: Buffer, mimetype: string): Promise<string> {
    const path = join(this.uploadDir, filename);
    await fs.writeFile(path, buffer);
    this.logger.log(`File saved locally: ${path}`);
    return path;
  }

  async delete(path: string): Promise<void> {
    try {
      await fs.unlink(path);
      this.logger.log(`File deleted: ${path}`);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${path}`, error);
    }
  }

  async getSignedUrl(path: string, expiresIn: number): Promise<string> {
    // For local storage, return a simple file path
    return `file://${path}`;
  }
}
