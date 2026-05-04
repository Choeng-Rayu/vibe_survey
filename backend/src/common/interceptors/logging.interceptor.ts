import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { Request } from 'express';
import { randomUUID } from 'crypto';

// Req 20.3: Request/response logging with correlation IDs
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();
    const correlationId = (req.headers['x-correlation-id'] as string) ?? randomUUID();
    const { method, url } = req;
    const start = Date.now();

    // Attach correlation ID for downstream use
    req.headers['x-correlation-id'] = correlationId;

    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - start;
        this.logger.log(`[${correlationId}] ${method} ${url} +${ms}ms`);
      }),
    );
  }
}
