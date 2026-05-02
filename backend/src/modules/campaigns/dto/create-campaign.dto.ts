import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsObject,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  survey_id!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsNotEmpty()
  targeting!: any;

  @IsNumber()
  @Min(0)
  budget_total!: number;

  @IsNumber()
  @Min(0)
  cpr!: number;

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
