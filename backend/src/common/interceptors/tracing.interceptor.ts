// Req 20.6: Tracing interceptor for HTTP requests
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TracingService } from '../tracing/tracing.service.js';

@Injectable()
export class TracingInterceptor implements NestInterceptor {
  constructor(private readonly tracingService: TracingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, headers } = request;

    const span = this.tracingService.startSpan(`HTTP ${method} ${url}`, {
      'http.method': method,
      'http.url': url,
      'http.user_agent': headers['user-agent'],
    });

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          span.setAttribute('http.status_code', context.switchToHttp().getResponse().statusCode);
          span.setAttribute('http.duration_ms', Date.now() - startTime);
          span.end();
        },
        error: (error) => {
          span.setAttribute('http.status_code', 500);
          span.setAttribute('error', true);
          span.setAttribute('error.message', error.message);
          span.end();
        },
      }),
    );
  }
}
