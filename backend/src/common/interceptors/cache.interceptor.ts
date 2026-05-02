// Req 18.2: Cache interceptor for automatic caching
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../cache/cache.service.js';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheInterceptor.name);

  constructor(private readonly cacheService: CacheService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    // Only cache GET requests
    if (method !== 'GET') {
      return next.handle();
    }

    const cacheKey = `http:${url}`;
    const cached = await this.cacheService.get(cacheKey);

    if (cached) {
      this.logger.debug(`Cache hit: ${cacheKey}`);
      return of(cached);
    }

    this.logger.debug(`Cache miss: ${cacheKey}`);
    return next.handle().pipe(
      tap(async (response) => {
        await this.cacheService.set(cacheKey, response, 300); // 5 min TTL
      }),
    );
  }
}
