import { IsString, IsObject, IsOptional, IsNumber, Min } from 'class-validator';

// Requirement 10.7: Survey completion and submission
// Requirement 26.2: Response validation with required fields
export class SubmitResponseDto {
  @IsString()
  survey_id!: string;

  @IsOptional()
  @IsString()
  campaign_id?: string;

  @IsObject()
  answers!: Record<string, any>;

  @IsOptional()
  @IsObject()
  behavioral_data?: {
    response_times?: Record<string, number>;
    click_events?: any[];
    scroll_events?: any[];
    mouse_movements?: any[];
    focus_events?: any[];
  };
}

// Requirement 10.6: Auto-save functionality
export class AutoSaveDto {
  @IsObject()
  answers!: Record<string, any>;

  @IsOptional()
  @IsObject()
  behavioral_data?: Record<string, any>;

  @IsOptional()
  @IsNumber()
  @Min(0)
  time_spent?: number;
}

export class StartSurveyDto {
  @IsString()
  survey_id!: string;

  @IsOptional()
  @IsString()
  campaign_id?: string;
}
