// Req 14: Admin Management System
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Req 14.3: List users for admin */
  async listUsers(params?: { skip?: number; take?: number; search?: string }) {
    const where: any = { deleted_at: null };
    if (params?.search) {
      where.OR = [
        { email: { contains: params.search, mode: 'insensitive' } },
        { phone: { contains: params.search } },
      ];
    }
    return this.prisma.user.findMany({
      where,
      select: { id: true, email: true, phone: true, role: true, is_suspended: true, is_banned: true, trust_tier: true, created_at: true },
      skip: params?.skip ?? 0,
      take: params?.take ?? 20,
      orderBy: { created_at: 'desc' },
    });
  }

  /** Req 14.3: Get user details */
  async getUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /** Req 14.3: Suspend user */
  async suspendUser(userId: string, adminId: string, reason: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { is_suspended: true, suspension_reason: reason },
    });
    await this.prisma.auditLog.create({
      data: { user_id: adminId, action: 'suspend', entity_type: 'user', entity_id: userId, new_value: { reason } as any },
    });
    this.logger.log(`User ${userId} suspended by ${adminId}`);
    return user;
  }

  /** Req 14.3: Ban user */
  async banUser(userId: string, adminId: string, reason: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { is_banned: true, ban_reason: reason },
    });
    await this.prisma.auditLog.create({
      data: { user_id: adminId, action: 'ban', entity_type: 'user', entity_id: userId, new_value: { reason } as any },
    });
    this.logger.log(`User ${userId} banned by ${adminId}`);
    return user;
  }

  /** Req 14.3: Unban user */
  async unbanUser(userId: string, adminId: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { is_banned: false, ban_reason: null },
    });
    await this.prisma.auditLog.create({
      data: { user_id: adminId, action: 'update', entity_type: 'user', entity_id: userId, new_value: { is_banned: false } as any },
    });
    return user;
  }

  /** Req 14.5: Get audit logs */
  async getAuditLogs(params?: { skip?: number; take?: number; entity_type?: string; action?: string }) {
    return this.prisma.auditLog.findMany({
      where: {
        ...(params?.entity_type ? { entity_type: params.entity_type } : {}),
        ...(params?.action ? { action: params.action as any } : {}),
      },
      orderBy: { created_at: 'desc' },
      skip: params?.skip ?? 0,
      take: params?.take ?? 50,
    });
  }
}
