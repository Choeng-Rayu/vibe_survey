import { Controller, Get, Req, Res, UseGuards, Param } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

// Req 15: Real-Time Communication - SSE for one-way updates
@Controller('sse')
@UseGuards(JwtAuthGuard)
export class SseController {
  private connections = new Map<string, Response>();

  @Get('notifications')
  async streamNotifications(@CurrentUser() user: any, @Res() res: Response): Promise<void> {
    const userId = user.id;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    this.connections.set(`notifications-${userId}`, res);

    // Heartbeat every 30s
    const heartbeat = setInterval(() => {
      res.write(': heartbeat\n\n');
    }, 30000);

    res.on('close', () => {
      clearInterval(heartbeat);
      this.connections.delete(`notifications-${userId}`);
    });
  }

  @Get('analytics/:campaignId')
  async streamAnalytics(
    @Param('campaignId') campaignId: string,
    @CurrentUser() user: any,
    @Res() res: Response,
  ): Promise<void> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const key = `analytics-${campaignId}-${user.id}`;
    this.connections.set(key, res);

    const heartbeat = setInterval(() => {
      res.write(': heartbeat\n\n');
    }, 30000);

    res.on('close', () => {
      clearInterval(heartbeat);
      this.connections.delete(key);
    });
  }

  @Get('system/status')
  async streamSystemStatus(@Res() res: Response): Promise<void> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const key = `system-status-${Date.now()}`;
    this.connections.set(key, res);

    const heartbeat = setInterval(() => {
      res.write(': heartbeat\n\n');
    }, 30000);

    res.on('close', () => {
      clearInterval(heartbeat);
      this.connections.delete(key);
    });
  }

  // Send event to specific connection
  sendEvent(key: string, event: string, data: any): void {
    const connection = this.connections.get(key);
    if (connection) {
      connection.write(`event: ${event}\n`);
      connection.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  }

  // Broadcast to all connections matching pattern
  broadcast(pattern: string, event: string, data: any): void {
    for (const [key, connection] of this.connections.entries()) {
      if (key.startsWith(pattern)) {
        connection.write(`event: ${event}\n`);
        connection.write(`data: ${JSON.stringify(data)}\n\n`);
      }
    }
  }
}
