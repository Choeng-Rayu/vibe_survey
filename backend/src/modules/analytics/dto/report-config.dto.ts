// Req 13: Custom Report Generation
import { IsString, IsOptional, IsArray, IsEnum, IsDateString, IsBoolean } from 'class-validator';

export enum ReportFormat {
  JSON = 'json',
  CSV = 'csv',
  PDF = 'pdf',
}

export enum ReportType {
  CAMPAIGN_PERFORMANCE = 'campaign_performance',
  DEMOGRAPHIC_BREAKDOWN = 'demographic_breakdown',
  RESPONSE_QUALITY = 'response_quality',
  TREND_ANALYSIS = 'trend_analysis',
}

export class ReportConfigDto {
  @IsString()
  name!: string;

  @IsEnum(ReportType)
  type!: ReportType;

  @IsEnum(ReportFormat)
  format!: ReportFormat;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  campaign_ids?: string[];

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsBoolean()
  anonymize?: boolean = false;

  @IsOptional()
  @IsString()
  schedule_cron?: string; // e.g. "0 9 * * 1" for weekly Monday 9am
}
