// Req 13: Analytics data access layer
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class AnalyticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getCampaignResponses(campaignId: string, startDate?: Date, endDate?: Date) {
    return this.prisma.response.findMany({
      where: {
        campaign_id: campaignId,
        deleted_at: null,
        ...(startDate || endDate ? { created_at: { gte: startDate, lte: endDate } } : {}),
      },
      select: {
        id: true,
        status: true,
        fraud_score: true,
        quality_label: true,
        time_spent: true,
        created_at: true,
        completed_at: true,
        user: { select: { profile: { select: { gender: true, country: true } } } },
      },
    });
  }

  async getCampaignMetrics(campaignId: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      select: {
        id: true,
        title: true,
        status: true,
        budget_total: true,
        budget_spent: true,
        cpr: true,
        max_responses: true,
        response_count: true,
        starts_at: true,
        ends_at: true,
        created_at: true,
      },
    });
    return campaign;
  }

  async getResponseCountByDate(campaignId: string, startDate?: Date, endDate?: Date) {
    return this.prisma.response.groupBy({
      by: ['created_at'],
      where: {
        campaign_id: campaignId,
        deleted_at: null,
        ...(startDate || endDate ? { created_at: { gte: startDate, lte: endDate } } : {}),
      },
      _count: { id: true },
      orderBy: { created_at: 'asc' },
    });
  }

  async getDemographicBreakdown(campaignId: string) {
    return this.prisma.response.findMany({
      where: { campaign_id: campaignId, deleted_at: null },
      select: {
        user: {
          select: {
            profile: {
              select: {
                gender: true,
                country: true,
                city: true,
                education_level: true,
                income_range: true,
              },
            },
          },
        },
      },
    });
  }

  async getQualityMetrics(campaignId: string) {
    return this.prisma.response.groupBy({
      by: ['quality_label'],
      where: { campaign_id: campaignId, deleted_at: null },
      _count: { id: true },
      _avg: { fraud_score: true },
    });
  }

  async getMultipleCampaignMetrics(campaignIds: string[], startDate?: Date, endDate?: Date) {
    return this.prisma.response.groupBy({
      by: ['campaign_id'],
      where: {
        campaign_id: { in: campaignIds },
        deleted_at: null,
        ...(startDate || endDate ? { created_at: { gte: startDate, lte: endDate } } : {}),
      },
      _count: { id: true },
      _avg: { fraud_score: true, time_spent: true },
    });
  }

  async createAuditLog(data: {
    user_id?: string;
    action: string;
    entity_type: string;
    entity_id: string;
    new_value?: object;
    ip_address?: string;
  }) {
    return this.prisma.auditLog.create({ data: data as any });
  }
}
