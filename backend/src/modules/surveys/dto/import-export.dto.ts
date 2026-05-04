import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ExportSurveyDto {
  @IsEnum(['json', 'excel', 'pdf'])
  format!: 'json' | 'excel' | 'pdf';

  @IsOptional()
  @IsString()
  surveyId?: string;
}

export class ImportSurveyDto {
  @IsString()
  filename!: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
