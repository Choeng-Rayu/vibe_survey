// Req 19.1: Redis-backed rate limiting storage
import { Injectable } from '@nestjs/common';
import { ThrottlerStorage } from '@nestjs/throttler';
import { CacheService } from '../cache/cache.service.js';

interface ThrottlerStorageRecord {
  totalHits: number;
  timeToExpire: number;
  isBlocked: boolean;
  timeToBlockExpire: number;
}

@Injectable()
export class RedisThrottlerStorage implements ThrottlerStorage {
  constructor(private readonly cacheService: CacheService) {}

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    throttlerName: string,
  ): Promise<ThrottlerStorageRecord> {
    const current = await this.cacheService.get<number>(key);
    const totalHits = (current || 0) + 1;
    await this.cacheService.set(key, totalHits, Math.ceil(ttl / 1000));
    
    return {
      totalHits,
      timeToExpire: ttl,
      isBlocked: false,
      timeToBlockExpire: 0,
    };
  }
}
