// Req 15.6: Connection management and authentication
import { Injectable, Logger } from '@nestjs/common';

interface Connection {
  userId: string;
  socketId: string;
  rooms: Set<string>;
  connectedAt: Date;
}

@Injectable()
export class ConnectionManagerService {
  private readonly logger = new Logger(ConnectionManagerService.name);
  private connections = new Map<string, Connection>();

  addConnection(socketId: string, userId: string) {
    this.connections.set(socketId, {
      userId,
      socketId,
      rooms: new Set(),
      connectedAt: new Date(),
    });
    this.logger.log(`User ${userId} connected: ${socketId}`);
  }

  removeConnection(socketId: string) {
    const conn = this.connections.get(socketId);
    if (conn) {
      this.logger.log(`User ${conn.userId} disconnected: ${socketId}`);
      this.connections.delete(socketId);
    }
  }

  joinRoom(socketId: string, room: string) {
    const conn = this.connections.get(socketId);
    if (conn) {
      conn.rooms.add(room);
      this.logger.log(`Socket ${socketId} joined room: ${room}`);
    }
  }

  leaveRoom(socketId: string, room: string) {
    const conn = this.connections.get(socketId);
    if (conn) {
      conn.rooms.delete(room);
    }
  }

  getConnectionsByRoom(room: string): string[] {
    return Array.from(this.connections.values())
      .filter((conn) => conn.rooms.has(room))
      .map((conn) => conn.socketId);
  }

  getConnectionsByUser(userId: string): string[] {
    return Array.from(this.connections.values())
      .filter((conn) => conn.userId === userId)
      .map((conn) => conn.socketId);
  }

  getConnectionCount(): number {
    return this.connections.size;
  }
}
