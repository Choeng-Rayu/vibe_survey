// Req 16: Notification System
import { IsString, IsOptional, IsEnum, IsObject } from 'class-validator';
import { NotificationChannel } from '@prisma/client';

export class SendNotificationDto {
  @IsString()
  user_id!: string;

  @IsEnum(NotificationChannel)
  channel!: NotificationChannel;

  @IsString()
  title!: string;

  @IsString()
  body!: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, any>;

  @IsOptional()
  @IsString()
  template_id?: string;
}
