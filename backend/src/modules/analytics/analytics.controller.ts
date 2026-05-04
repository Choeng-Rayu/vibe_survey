// Req 13: Analytics and Reporting endpoints
import { Controller, Get, Post, Param, Query, Body, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service.js';
import { ReportingService } from './reporting.service.js';
import { AnalyticsQueryDto } from './dto/analytics-query.dto.js';
import { ReportConfigDto } from './dto/report-config.dto.js';

@Controller()
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly reportingService: ReportingService,
  ) {}

  // GET /api/v1/campaigns/:id/analytics
  @Get('campaigns/:id/analytics')
  getCampaignAnalytics(@Param('id') id: string, @Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getCampaignAnalytics(id, query);
  }

  // GET /api/v1/campaigns/:id/analytics/real-time
  @Get('campaigns/:id/analytics/real-time')
  getRealTimeAnalytics(@Param('id') id: string) {
    return this.analyticsService.getCampaignAnalytics(id, {});
  }

  // GET /api/v1/campaigns/:id/demographics
  @Get('campaigns/:id/demographics')
  getDemographics(@Param('id') id: string) {
    return this.analyticsService.getDemographics(id);
  }

  // GET /api/v1/campaigns/:id/quality
  @Get('campaigns/:id/quality')
  getQualityMetrics(@Param('id') id: string) {
    return this.analyticsService.getQualityMetrics(id);
  }

  // GET /api/v1/analytics/dashboard
  @Get('analytics/dashboard')
  getDashboard(@Request() req: any) {
    return this.analyticsService.getDashboard(req.user?.id);
  }

  // GET /api/v1/analytics/trends
  @Get('analytics/trends')
  getTrends(@Query('campaign_ids') campaignIds: string, @Query() query: AnalyticsQueryDto) {
    const ids = campaignIds ? campaignIds.split(',') : [];
    return this.analyticsService.getTrends(ids, query);
  }

  // GET /api/v1/analytics/benchmarks
  @Get('analytics/benchmarks')
  getBenchmarks() {
    return { message: 'Benchmark data', avg_completion_rate: 0.72, avg_fraud_score: 15 };
  }

  // GET /api/v1/analytics/reports
  @Get('analytics/reports')
  listReports(@Request() req: any) {
    return { reports: [], user_id: req.user?.id };
  }

  // POST /api/v1/analytics/reports/schedule
  @Post('analytics/reports/schedule')
  scheduleReport(@Request() req: any, @Body() dto: ReportConfigDto) {
    return this.reportingService.scheduleReport(req.user?.id, dto);
  }

  // POST /api/v1/campaigns/:id/export
  @Post('campaigns/:id/export')
  exportCampaign(@Param('id') id: string, @Request() req: any, @Body() dto: ReportConfigDto) {
    return this.reportingService.generateReport(req.user?.id, { ...dto, campaign_ids: [id] });
  }
}
