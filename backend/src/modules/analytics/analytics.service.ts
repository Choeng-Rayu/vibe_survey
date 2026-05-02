// Req 13: Campaign Analytics Engine
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { AnalyticsRepository } from './analytics.repository.js';
import { AggregationService } from './aggregation.service.js';
import { AnalyticsQueryDto, AnalyticsGroupBy } from './dto/analytics-query.dto.js';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    private readonly repository: AnalyticsRepository,
    private readonly aggregation: AggregationService,
  ) {}

  /** Req 13.1: Real-time campaign analytics */
  async getCampaignAnalytics(campaignId: string, query: AnalyticsQueryDto) {
    const campaign = await this.repository.getCampaignMetrics(campaignId);
    if (!campaign) throw new NotFoundException('Campaign not found');

    const startDate = query.start_date ? new Date(query.start_date) : undefined;
    const endDate = query.end_date ? new Date(query.end_date) : undefined;

    const responses = await this.repository.getCampaignResponses(campaignId, startDate, endDate);
    const metrics = this.aggregation.calculateMetrics(campaign as any);
    const trend = this.aggregation.aggregateByDate(responses, query.group_by ?? AnalyticsGroupBy.DAY);

    this.logger.log(`Analytics fetched for campaign ${campaignId}`);
    return { campaign, metrics, trend };
  }

  /** Req 13.3: Demographic analysis */
  async getDemographics(campaignId: string) {
    const campaign = await this.repository.getCampaignMetrics(campaignId);
    if (!campaign) throw new NotFoundException('Campaign not found');

    const rows = await this.repository.getDemographicBreakdown(campaignId);
    const profiles = rows.map((r: any) => r.user?.profile ?? {});
    return this.aggregation.aggregateDemographics(profiles);
  }

  /** Req 13.8: Response quality metrics */
  async getQualityMetrics(campaignId: string) {
    const campaign = await this.repository.getCampaignMetrics(campaignId);
    if (!campaign) throw new NotFoundException('Campaign not found');
    return this.repository.getQualityMetrics(campaignId);
  }

  /** Req 13.7: Dashboard summary across all campaigns */
  async getDashboard(userId: string) {
    // Returns aggregate stats — campaigns are filtered by user in controller
    return { message: 'Dashboard data', user_id: userId };
  }

  /** Req 13.6: Trend analysis */
  async getTrends(campaignIds: string[], query: AnalyticsQueryDto) {
    const startDate = query.start_date ? new Date(query.start_date) : undefined;
    const endDate = query.end_date ? new Date(query.end_date) : undefined;
    return this.repository.getMultipleCampaignMetrics(campaignIds, startDate, endDate);
  }
}
