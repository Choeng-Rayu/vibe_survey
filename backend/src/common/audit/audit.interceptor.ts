import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { Request } from 'express';
import { AuditService } from './audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request & { user?: { id?: string } }>();
    const auditableMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

    return next.handle().pipe(
      tap(() => {
        if (!auditableMethods.has(request.method)) return;
        void this.auditService.log({
          action: `${request.method}:${request.path}`,
          actor_id: request.user?.id,
          target_type: request.path.split('/').filter(Boolean).at(1) ?? 'request',
          target_id: String(request.params?.['id'] ?? 'unknown'),
          new_value: request.body,
          ip: request.ip,
          user_agent: request.headers['user-agent'],
        });
      }),
    );
  }
}
