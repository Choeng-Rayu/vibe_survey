import { IsString, IsObject, IsOptional, IsEnum } from 'class-validator';

export class CreateSurveyDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsObject()
  definition!: any;

  @IsOptional()
  @IsEnum(['draft', 'active', 'paused', 'completed', 'archived'])
  status?: string;
}

export class UpdateSurveyDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  definition?: any;

  @IsOptional()
  @IsEnum(['draft', 'active', 'paused', 'completed', 'archived'])
  status?: string;
}
