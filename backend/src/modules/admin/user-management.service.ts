// Req 14.3, 14.7: User Account Management with bulk operations
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { UserAction } from './dto/user-moderation.dto.js';

@Injectable()
export class UserManagementService {
  private readonly logger = new Logger(UserManagementService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Req 14.7: Bulk user operations */
  async bulkUserAction(userIds: string[], adminId: string, action: UserAction, reason?: string) {
    const results = await Promise.allSettled(
      userIds.map((id) => this.performAction(id, adminId, action, reason)),
    );
    return {
      total: userIds.length,
      succeeded: results.filter((r) => r.status === 'fulfilled').length,
      failed: results.filter((r) => r.status === 'rejected').length,
    };
  }

  /** Req 14.3: User export for compliance */
  async exportUsers(userIds?: string[], format: 'json' | 'csv' = 'json') {
    const where = userIds ? { id: { in: userIds } } : { deleted_at: null };
    const users = await this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        is_suspended: true,
        is_banned: true,
        trust_tier: true,
        created_at: true,
        profile: { select: { first_name: true, last_name: true, country: true } },
      },
    });

    if (format === 'csv') {
      return this.toCSV(users);
    }
    return users;
  }

  /** Req 14.3: Account recovery workflow */
  async recoverAccount(userId: string, adminId: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { is_suspended: false, is_banned: false, suspension_reason: null, ban_reason: null },
    });
    await this.prisma.auditLog.create({
      data: {
        user_id: adminId,
        action: 'update',
        entity_type: 'user',
        entity_id: userId,
        new_value: { recovered: true } as any,
      },
    });
    this.logger.log(`Account ${userId} recovered by ${adminId}`);
    return user;
  }

  private async performAction(userId: string, adminId: string, action: UserAction, reason?: string) {
    switch (action) {
      case UserAction.SUSPEND:
        return this.prisma.user.update({
          where: { id: userId },
          data: { is_suspended: true, suspension_reason: reason },
        });
      case UserAction.BAN:
        return this.prisma.user.update({
          where: { id: userId },
          data: { is_banned: true, ban_reason: reason },
        });
      case UserAction.UNSUSPEND:
        return this.prisma.user.update({
          where: { id: userId },
          data: { is_suspended: false, suspension_reason: null },
        });
      case UserAction.UNBAN:
        return this.prisma.user.update({
          where: { id: userId },
          data: { is_banned: false, ban_reason: null },
        });
    }
  }

  private toCSV(data: any[]): string {
    if (!data.length) return '';
    const keys = ['id', 'email', 'phone', 'role', 'is_suspended', 'is_banned', 'trust_tier', 'created_at'];
    const header = keys.join(',');
    const rows = data.map((row) => keys.map((k) => JSON.stringify(row[k] ?? '')).join(','));
    return [header, ...rows].join('\n');
  }
}
