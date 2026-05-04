import { IsString, IsOptional, IsNumber, IsObject, IsDateString, Min } from 'class-validator';

export class UpdateCampaignDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  targeting?: any;

  @IsNumber()
  @IsOptional()
  @Min(0)
  budget_total?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  cpr?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  max_responses?: number;

  @IsDateString()
  @IsOptional()
  starts_at?: string;

  @IsDateString()
  @IsOptional()
  ends_at?: string;
}
