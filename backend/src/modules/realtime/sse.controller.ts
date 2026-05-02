// Req 15.2: Server-Sent Events for one-way real-time updates
import { Controller, Sse, Query, Request } from '@nestjs/common';
import { Observable, interval, map } from 'rxjs';
import { Logger } from '@nestjs/common';

interface SseEvent {
  data: any;
  id?: string;
  type?: string;
  retry?: number;
}

@Controller('sse')
export class SseController {
  private readonly logger = new Logger(SseController.name);

  // GET /api/v1/sse/notifications - Req 15.5
  @Sse('notifications')
  streamNotifications(@Request() req: any): Observable<SseEvent> {
    const userId = req.user?.id;
    this.logger.log(`SSE notifications stream opened for user ${userId}`);
    
    // Req 15.10: Connection heartbeat
    return interval(30000).pipe(
      map(() => ({
        data: { type: 'heartbeat', timestamp: new Date() },
        id: Date.now().toString(),
      })),
    );
  }

  // GET /api/v1/sse/analytics/:campaignId - Req 15.4
  @Sse('analytics/:campaignId')
  streamAnalytics(@Query('campaignId') campaignId: string, @Request() req: any): Observable<SseEvent> {
    this.logger.log(`SSE analytics stream opened for campaign ${campaignId}`);
    
    return interval(5000).pipe(
      map(() => ({
        data: {
          campaignId,
          metrics: { responses: 0, completion_rate: 0 },
          timestamp: new Date(),
        },
        type: 'analytics_update',
      })),
    );
  }

  // GET /api/v1/sse/system/status - Req 15.8
  @Sse('system/status')
  streamSystemStatus(): Observable<SseEvent> {
    this.logger.log('SSE system status stream opened');
    
    return interval(10000).pipe(
      map(() => ({
        data: {
          status: 'healthy',
          uptime: process.uptime(),
          timestamp: new Date(),
        },
        type: 'system_status',
      })),
    );
  }
}
