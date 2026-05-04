// Req 13: Custom Report Generation
import { Injectable, Logger } from '@nestjs/common';
import { ReportConfigDto, ReportFormat, ReportType } from './dto/report-config.dto.js';
import { AnalyticsRepository } from './analytics.repository.js';

@Injectable()
export class ReportingService {
  private readonly logger = new Logger(ReportingService.name);

  constructor(private readonly repository: AnalyticsRepository) {}

  /** Req 13.2: Custom report builder */
  async generateReport(userId: string, config: ReportConfigDto) {
    this.logger.log(`Generating ${config.type} report for user ${userId}`);

    const startDate = config.start_date ? new Date(config.start_date) : undefined;
    const endDate = config.end_date ? new Date(config.end_date) : undefined;

    let data: any;
    if (config.type === ReportType.CAMPAIGN_PERFORMANCE && config.campaign_ids) {
      data = await this.repository.getMultipleCampaignMetrics(
        config.campaign_ids,
        startDate,
        endDate,
      );
    } else if (config.type === ReportType.DEMOGRAPHIC_BREAKDOWN && config.campaign_ids?.[0]) {
      data = await this.repository.getDemographicBreakdown(config.campaign_ids[0]);
    } else if (config.type === ReportType.RESPONSE_QUALITY && config.campaign_ids?.[0]) {
      data = await this.repository.getQualityMetrics(config.campaign_ids[0]);
    } else {
      data = { message: 'Report type not implemented' };
    }

    // Req 13.5: Data export with anonymization
    if (config.anonymize) {
      data = this.anonymizeData(data);
    }

    // Format output
    const formatted = this.formatReport(data, config.format);

    // Req 13.7: Report history tracking
    await this.repository.createAuditLog({
      user_id: userId,
      action: 'create',
      entity_type: 'report',
      entity_id: config.name,
      new_value: { config },
    });

    return { name: config.name, format: config.format, data: formatted };
  }

  /** Req 13.3: Report scheduling (placeholder for cron integration) */
  async scheduleReport(userId: string, config: ReportConfigDto) {
    if (!config.schedule_cron) throw new Error('schedule_cron is required');
    this.logger.log(`Scheduled report ${config.name} with cron: ${config.schedule_cron}`);
    // In production, integrate with Bull queue or cron scheduler
    return { message: 'Report scheduled', cron: config.schedule_cron };
  }

  private anonymizeData(data: any): any {
    // Remove PII fields
    if (Array.isArray(data)) {
      return data.map((item) => this.anonymizeData(item));
    }
    if (typeof data === 'object' && data !== null) {
      const { user, user_id, email, phone, ...rest } = data;
      return rest;
    }
    return data;
  }

  private formatReport(data: any, format: ReportFormat): any {
    if (format === ReportFormat.JSON) return data;
    if (format === ReportFormat.CSV) return this.toCSV(data);
    if (format === ReportFormat.PDF) return { message: 'PDF generation not implemented', data };
    return data;
  }

  private toCSV(data: any): string {
    if (!Array.isArray(data) || data.length === 0) return '';
    const keys = Object.keys(data[0]);
    const header = keys.join(',');
    const rows = data.map((row) => keys.map((k) => JSON.stringify(row[k] ?? '')).join(','));
    return [header, ...rows].join('\n');
  }
}
