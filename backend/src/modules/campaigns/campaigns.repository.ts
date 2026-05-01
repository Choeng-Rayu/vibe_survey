import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma, CampaignStatus } from '@prisma/client';

@Injectable()
export class CampaignsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.CampaignCreateInput) {
    return this.prisma.campaign.create({ data });
  }

  async findById(id: string) {
    return this.prisma.campaign.findUnique({
      where: { id },
      include: { survey: true, user: { select: { id: true, email: true } } },
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.CampaignWhereInput;
    orderBy?: Prisma.CampaignOrderByWithRelationInput;
  }) {
    return this.prisma.campaign.findMany(params);
  }

  async update(id: string, data: Prisma.CampaignUpdateInput) {
    return this.prisma.campaign.update({ where: { id }, data });
  }

  async softDelete(id: string) {
    return this.prisma.campaign.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }

  async createStatusHistory(campaignId: string, fromStatus: CampaignStatus | null, toStatus: CampaignStatus, changedBy: string, note?: string) {
    return this.prisma.campaignStatusHistory.create({
      data: {
        campaign_id: campaignId,
        from_status: fromStatus,
        to_status: toStatus,
        changed_by: changedBy,
        note,
      },
    });
  }

  async getStatusHistory(campaignId: string) {
    return this.prisma.campaignStatusHistory.findMany({
      where: { campaign_id: campaignId },
      orderBy: { created_at: 'desc' },
    });
  }
}
