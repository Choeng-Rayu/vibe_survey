// Req 14: Campaign Review and Approval Workflow
import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';

export enum ReviewAction {
  APPROVE = 'approve',
  REJECT = 'reject',
  REQUEST_REVISION = 'request_revision',
}

export class CampaignReviewDto {
  @IsEnum(ReviewAction)
  action!: ReviewAction;

  @IsOptional()
  @IsString()
  note?: string;
}

export class BulkReviewDto {
  @IsArray()
  @IsString({ each: true })
  campaign_ids!: string[];

  @IsEnum(ReviewAction)
  action!: ReviewAction;

  @IsOptional()
  @IsString()
  note?: string;
}
