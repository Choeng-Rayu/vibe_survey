// Req 15: Real-Time Communication Module
import { Module } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway.js';
import { ConnectionManagerService } from './connection-manager.service.js';
import { SseController } from './sse.controller.js';

@Module({
  controllers: [SseController],
  providers: [RealtimeGateway, ConnectionManagerService],
  exports: [RealtimeGateway, ConnectionManagerService],
})
export class RealtimeModule {}
