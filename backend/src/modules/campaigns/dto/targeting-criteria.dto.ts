import { IsOptional, IsArray, IsString, IsNumber, IsEnum, Min, Max, IsObject } from 'class-validator';

// Requirement 9: Audience Targeting - Targeting Criteria DTO
export class DemographicCriteriaDto {
  @IsNumber()
  @IsOptional()
  @Min(13)
  @Max(100)
  age_min?: number;

  @IsNumber()
  @IsOptional()
  @Min(13)
  @Max(100)
  age_max?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  gender?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  education_level?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  income_range?: string[];
}

export class GeographicCriteriaDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  countries?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  regions?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  cities?: string[];
}

export class TargetingCriteriaDto {
  @IsObject()
  @IsOptional()
  demographics?: DemographicCriteriaDto;

  @IsObject()
  @IsOptional()
  geographic?: GeographicCriteriaDto;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interests?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  behaviors?: string[];

  @IsEnum(['AND', 'OR'])
  @IsOptional()
  logic?: 'AND' | 'OR';
}

export class LookalikeAudienceDto {
  @IsArray()
  @IsString({ each: true })
  source_user_ids!: string[];

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1)
  similarity_threshold?: number;
}
