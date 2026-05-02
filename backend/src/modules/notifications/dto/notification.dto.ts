import { IsString, IsArray, IsOptional, IsObject } from 'class-validator';

export class SendNotificationDto {
  @IsString()
  userId!: string;

  @IsArray()
  channels!: ('email' | 'sms' | 'push' | 'in_app')[];

  @IsString()
  type!: string;

  @IsString()
  title!: string;

  @IsString()
  body!: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, any>;
}

export class NotificationPreferencesDto {
  @IsOptional()
  email?: boolean;

  @IsOptional()
  sms?: boolean;

  @IsOptional()
  push?: boolean;

  @IsOptional()
  in_app?: boolean;
}
