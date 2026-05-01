import { IsOptional, IsInt, Min, IsString, IsEnum } from 'class-validator';

// Requirement 10.1: Survey feed generation with personalized recommendations
export class SurveyFeedQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(['match_score', 'reward', 'estimated_time'])
  sort_by?: 'match_score' | 'reward' | 'estimated_time' = 'match_score';
}

export interface SurveyFeedItemDto {
  id: string;
  title: string;
  description: string;
  estimated_time: number;
  reward_points: number;
  match_score: number;
  category: string;
  question_count: number;
  campaign_id: string;
}

export interface SurveyFeedResponseDto {
  surveys: SurveyFeedItemDto[];
  next_cursor?: string;
  total_available: number;
}
