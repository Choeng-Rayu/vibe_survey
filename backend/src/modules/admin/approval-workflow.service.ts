// Req 14: Campaign Review and Approval Workflow
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CampaignStatus } from '@prisma/client';
import { ReviewAction } from './dto/campaign-review.dto.js';

@Injectable()
export class ApprovalWorkflowService {
  private readonly logger = new Logger(ApprovalWorkflowService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Req 14.1: Get campaigns pending review */
  async getReviewQueue(params?: { skip?: number; take?: number }) {
    return this.prisma.campaign.findMany({
      where: { status: CampaignStatus.pending_review, deleted_at: null },
      include: {
        user: { select: { id: true, email: true } },
        survey: { select: { id: true, title: true } },
      },
      orderBy: { updated_at: 'asc' },
      skip: params?.skip ?? 0,
      take: params?.take ?? 20,
    });
  }

  /** Req 14.1: Approve campaign */
  async approveCampaign(campaignId: string, reviewerId: string, note?: string) {
    return this.reviewCampaign(campaignId, reviewerId, ReviewAction.APPROVE, note);
  }

  /** Req 14.1: Reject campaign */
  async rejectCampaign(campaignId: string, reviewerId: string, note?: string) {
    return this.reviewCampaign(campaignId, reviewerId, ReviewAction.REJECT, note);
  }

  /** Req 14.1: Request revision */
  async requestRevision(campaignId: string, reviewerId: string, note?: string) {
    return this.reviewCampaign(campaignId, reviewerId, ReviewAction.REQUEST_REVISION, note);
  }

  /** Req 14.7: Bulk approval operations */
  async bulkReview(campaignIds: string[], reviewerId: string, action: ReviewAction, note?: string) {
    const results = await Promise.allSettled(
      campaignIds.map((id) => this.reviewCampaign(id, reviewerId, action, note)),
    );
    return {
      total: campaignIds.length,
      succeeded: results.filter((r) => r.status === 'fulfilled').length,
      failed: results.filter((r) => r.status === 'rejected').length,
    };
  }

  private async reviewCampaign(
    campaignId: string,
    reviewerId: string,
    action: ReviewAction,
    note?: string,
  ) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign) throw new NotFoundException('Campaign not found');
    if (campaign.status !== CampaignStatus.pending_review) {
      throw new BadRequestException('Campaign is not pending review');
    }

    const toStatus = this.actionToStatus(action);
    const updated = await this.prisma.campaign.update({
      where: { id: campaignId },
      data: {
        status: toStatus,
        review_note: note,
        reviewed_by: reviewerId,
        reviewed_at: new Date(),
      },
    });

    // Req 14.5: Audit trail
    await this.prisma.auditLog.create({
      data: {
        user_id: reviewerId,
        action: action === ReviewAction.APPROVE ? 'approve' : 'reject',
        entity_type: 'campaign',
        entity_id: campaignId,
        new_value: { status: toStatus, note } as any,
      },
    });

    this.logger.log(`Campaign ${campaignId} ${action} by ${reviewerId}`);
    return updated;
  }

  private actionToStatus(action: ReviewAction): CampaignStatus {
    switch (action) {
      case ReviewAction.APPROVE:
        return CampaignStatus.approved;
      case ReviewAction.REJECT:
        return CampaignStatus.rejected;
      case ReviewAction.REQUEST_REVISION:
        return CampaignStatus.draft;
    }
  }
}
