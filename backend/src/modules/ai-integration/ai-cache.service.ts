import { Injectable, Logger } from '@nestjs/common';

// Requirement 6.8: AI response caching for performance
@Injectable()
export class AiCacheService {
  private readonly logger = new Logger(AiCacheService.name);
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly TTL = 3600000; // 1 hour

  async get(key: string): Promise<any | null> {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    this.logger.log(`Cache hit: ${key}`);
    return cached.data;
  }

  async set(key: string, data: any): Promise<void> {
    this.cache.set(key, { data, timestamp: Date.now() });
    this.logger.log(`Cache set: ${key}`);
  }

  async clear(pattern?: string): Promise<void> {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
    this.logger.log('Cache cleared');
  }

  generateKey(userId: string, prompt: string, mode: string): string {
    return `ai:${userId}:${mode}:${this.hashString(prompt)}`;
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }
}
