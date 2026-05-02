// Req 15.1: WebSocket support for real-time communication
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { ConnectionManagerService } from './connection-manager.service.js';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/ws' })
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(RealtimeGateway.name);

  constructor(private readonly connectionManager: ConnectionManagerService) {}

  // Req 15.6: Connection authentication
  async handleConnection(client: Socket) {
    const userId = client.handshake.auth?.userId || client.handshake.query?.userId;
    if (!userId) {
      client.disconnect();
      return;
    }
    this.connectionManager.addConnection(client.id, userId as string);
    client.emit('connected', { socketId: client.id, timestamp: new Date() });
  }

  handleDisconnect(client: Socket) {
    this.connectionManager.removeConnection(client.id);
  }

  // Req 15.7: Room/channel management
  @SubscribeMessage('join_room')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { room: string }) {
    client.join(data.room);
    this.connectionManager.joinRoom(client.id, data.room);
    return { event: 'joined_room', room: data.room };
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { room: string }) {
    client.leave(data.room);
    this.connectionManager.leaveRoom(client.id, data.room);
    return { event: 'left_room', room: data.room };
  }

  // Req 15.8: Message broadcasting
  broadcastToRoom(room: string, event: string, data: any) {
    this.server.to(room).emit(event, data);
    this.logger.log(`Broadcast to room ${room}: ${event}`);
  }

  // Req 15.5: Real-time notification delivery
  sendToUser(userId: string, event: string, data: any) {
    const sockets = this.connectionManager.getConnectionsByUser(userId);
    sockets.forEach((socketId) => {
      this.server.to(socketId).emit(event, data);
    });
  }

  // Req 15.4: Real-time analytics updates
  broadcastAnalytics(campaignId: string, data: any) {
    this.broadcastToRoom(`campaign:${campaignId}`, 'analytics_update', data);
  }

  // Req 15.3: Real-time survey response tracking
  broadcastResponse(surveyId: string, data: any) {
    this.broadcastToRoom(`survey:${surveyId}`, 'response_update', data);
  }
}
