import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { Prisma, CampaignStatus } from '@prisma/client';
import { PaginationHelper, PaginatedResult } from '../../common/utils/pagination.helper.js';

// Req 18.3: Query optimization
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
    limit?: number;
    cursor?: string;
    skip?: number;
    take?: number;
    where?: Prisma.CampaignWhereInput;
    orderBy?: Prisma.CampaignOrderByWithRelationInput;
  }): Promise<PaginatedResult<any> | any[]> {
    // Req 18.7: Cursor-based pagination
    if (params.limit !== undefined || params.cursor) {
      const limit = PaginationHelper.getLimit(params.limit);
      const data = await this.prisma.campaign.findMany({
        take: limit + 1,
        skip: params.cursor ? 1 : 0,
        cursor: params.cursor ? { id: params.cursor } : undefined,
        where: params.where,
        orderBy: params.orderBy || { created_at: 'desc' },
        select: {
          id: true,
          title: true,
          status: true,
          budget_total: true,
          budget_spent: true,
          starts_at: true,
          ends_at: true,
          created_at: true,
          survey: { select: { id: true, title: true } },
        },
      });
      const total = await this.prisma.campaign.count({ where: params.where });
      return PaginationHelper.buildResult(data, limit, total);
    }

    // Legacy offset pagination
    return this.prisma.campaign.findMany({
      skip: params.skip,
      take: params.take,
      where: params.where,
      orderBy: params.orderBy,
    });
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

  async createStatusHistory(
    campaignId: string,
    fromStatus: CampaignStatus | null,
    toStatus: CampaignStatus,
    changedBy: string,
    note?: string,
  ) {
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
