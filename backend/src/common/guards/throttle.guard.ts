// Req 19.1: Role-based rate limiting
import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';
import { RedisThrottlerStorage } from './redis-throttler.storage.js';

// Req 19.1: Rate limit tiers by role
const RATE_LIMITS = {
  survey_taker: { ttl: 60000, limit: 60 }, // 60 req/min
  advertiser: { ttl: 60000, limit: 120 }, // 120 req/min
  admin: { ttl: 60000, limit: 300 }, // 300 req/min
  default: { ttl: 60000, limit: 30 }, // 30 req/min for unauthenticated
};

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  constructor(
    protected readonly reflector: Reflector,
    protected readonly storageService: RedisThrottlerStorage,
  ) {
    super({ throttlers: [{ name: 'default', ttl: 60000, limit: 30 }] }, storageService, reflector);
  }

  async handleRequest(requestProps: any): Promise<boolean> {
    const { context } = requestProps;
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Req 19.1: Apply role-based limits
    const role = user?.role || 'default';
    const rateLimits = RATE_LIMITS[role as keyof typeof RATE_LIMITS] || RATE_LIMITS.default;

    const key = this.generateKey(context, request.ip);
    const result = await this.storageService.increment(
      key,
      rateLimits.ttl,
      rateLimits.limit,
      0,
      'default',
    );

    // Req 19: Add rate limit headers
    const response = context.switchToHttp().getResponse();
    response.header('X-RateLimit-Limit', rateLimits.limit.toString());
    response.header(
      'X-RateLimit-Remaining',
      Math.max(0, rateLimits.limit - result.totalHits).toString(),
    );
    response.header('X-RateLimit-Reset', new Date(Date.now() + rateLimits.ttl).toISOString());

    if (result.totalHits > rateLimits.limit) {
      throw new ThrottlerException('Rate limit exceeded');
    }

    return true;
  }

  protected generateKey(context: ExecutionContext, suffix: string): string {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const prefix = user ? `user:${user.id}` : `ip:${suffix}`;
    return `throttle:${prefix}`;
  }
}
