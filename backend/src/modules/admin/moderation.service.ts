// Req 14: Content Moderation System
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { ModerationStatus } from '@prisma/client';
import { ModerationActionType, FlagContentDto } from './dto/moderation-action.dto.js';

@Injectable()
export class ModerationService {
  private readonly logger = new Logger(ModerationService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Req 14.2: Get moderation queue */
  async getModerationQueue(params?: { skip?: number; take?: number; status?: ModerationStatus }) {
    return this.prisma.moderationItem.findMany({
      where: { status: params?.status ?? ModerationStatus.pending },
      orderBy: { created_at: 'asc' },
      skip: params?.skip ?? 0,
      take: params?.take ?? 20,
    });
  }

  /** Req 14.2: Flag content for moderation */
  async flagContent(flaggedBy: string, dto: FlagContentDto) {
    const item = await this.prisma.moderationItem.create({
      data: {
        entity_type: dto.entity_type,
        entity_id: dto.entity_id,
        reason: dto.reason,
        flagged_by: flaggedBy,
        status: ModerationStatus.flagged,
      },
    });
    this.logger.log(`Content flagged: ${dto.entity_type}/${dto.entity_id} by ${flaggedBy}`);
    return item;
  }

  /** Req 14.2: Take moderation action */
  async takeAction(
    itemId: string,
    reviewerId: string,
    action: ModerationActionType,
    note?: string,
  ) {
    const item = await this.prisma.moderationItem.findUnique({ where: { id: itemId } });
    if (!item) throw new NotFoundException('Moderation item not found');

    const status = this.actionToStatus(action);
    const updated = await this.prisma.moderationItem.update({
      where: { id: itemId },
      data: { status, reviewed_by: reviewerId, reviewed_at: new Date(), note },
    });

    // Req 14.5: Audit trail for moderation actions
    await this.prisma.auditLog.create({
      data: {
        user_id: reviewerId,
        action: action === ModerationActionType.APPROVE ? 'approve' : 'reject',
        entity_type: item.entity_type,
        entity_id: item.entity_id,
        new_value: { action, note } as any,
      },
    });

    this.logger.log(`Moderation action ${action} on item ${itemId} by ${reviewerId}`);
    return updated;
  }

  /** Req 14.2: Moderation reports/analytics */
  async getModerationReports() {
    const stats = await this.prisma.moderationItem.groupBy({
      by: ['status', 'entity_type'],
      _count: { id: true },
    });
    return stats;
  }

  private actionToStatus(action: ModerationActionType): ModerationStatus {
    switch (action) {
      case ModerationActionType.APPROVE:
        return ModerationStatus.approved;
      case ModerationActionType.REJECT:
      case ModerationActionType.REMOVE:
        return ModerationStatus.rejected;
      case ModerationActionType.FLAG:
        return ModerationStatus.flagged;
    }
  }
}
