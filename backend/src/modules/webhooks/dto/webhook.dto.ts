// Req 22: Webhook DTOs for registration and management
import { IsString, IsUrl, IsArray, IsBoolean, IsOptional } from 'class-validator';

export class CreateWebhookDto {
  @IsUrl()
  url!: string;

  @IsArray()
  @IsString({ each: true })
  events!: string[];
}

export class UpdateWebhookDto {
  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  events?: string[];

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class WebhookResponseDto {
  id!: string;
  url!: string;
  events!: string[];
  is_active!: boolean;
  last_used_at!: Date | null;
  created_at!: Date;
}
