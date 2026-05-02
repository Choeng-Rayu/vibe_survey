// Req 16.2: Notification templating and personalization
import { IsString, IsOptional, IsEnum, IsArray, IsBoolean } from 'class-validator';
import { NotificationChannel } from '@prisma/client';

export class CreateTemplateDto {
  @IsString()
  name!: string;

  @IsEnum(NotificationChannel)
  channel!: NotificationChannel;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsString()
  body_en!: string;

  @IsOptional()
  @IsString()
  body_km?: string; // Khmer translation

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variables?: string[];

  @IsOptional()
  @IsBoolean()
  is_active?: boolean = true;
}

export class UpdateTemplateDto {
  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  body_en?: string;

  @IsOptional()
  @IsString()
  body_km?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
