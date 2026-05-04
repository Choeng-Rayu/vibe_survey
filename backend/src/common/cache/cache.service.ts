// Req 18.1, 18.2: Redis-based caching with cache-aside pattern
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly redis: Redis;
  private readonly defaultTTL = 3600; // 1 hour

  constructor(private readonly configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
      password: this.configService.get('REDIS_PASSWORD'),
    });
  }

  // Req 18.2: Cache-aside pattern with TTL
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(this.namespaceKey(key));
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      this.logger.error(`Cache get error: ${error}`);
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = this.defaultTTL): Promise<void> {
    try {
      await this.redis.setex(this.namespaceKey(key), ttl, JSON.stringify(value));
      this.logger.debug(`Cached: ${key} (TTL: ${ttl}s)`);
    } catch (error) {
      this.logger.error(`Cache set error: ${error}`);
    }
  }

  // Req 18: Cache invalidation
  async del(key: string): Promise<void> {
    try {
      await this.redis.del(this.namespaceKey(key));
    } catch (error) {
      this.logger.error(`Cache delete error: ${error}`);
    }
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(this.namespaceKey(pattern));
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      this.logger.error(`Cache delete pattern error: ${error}`);
    }
  }

  // Req 18: Cache key namespacing
  private namespaceKey(key: string): string {
    return `vibe_survey:${key}`;
  }

  // Req 18.10: Cache analytics
  async getStats() {
    try {
      const info = await this.redis.info('stats');
      return { info };
    } catch (error) {
      this.logger.error(`Cache stats error: ${error}`);
      return null;
    }
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
