// Req 24.2: Local storage backend
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class LocalStorage {
  private readonly logger = new Logger(LocalStorage.name);
  private readonly uploadDir = './uploads';

  async save(filename: string, buffer: Buffer): Promise<string> {
    await fs.mkdir(this.uploadDir, { recursive: true });
    const filepath = path.join(this.uploadDir, filename);
    await fs.writeFile(filepath, buffer);
    this.logger.log(`File saved locally: ${filename}`);
    return filepath;
  }

  async get(filepath: string): Promise<Buffer> {
    return fs.readFile(filepath);
  }

  async delete(filepath: string): Promise<void> {
    await fs.unlink(filepath);
  }
}
