// Req 14: Content Moderation System
import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum ModerationActionType {
  APPROVE = 'approve',
  REJECT = 'reject',
  FLAG = 'flag',
  REMOVE = 'remove',
}

export class ModerationActionDto {
  @IsEnum(ModerationActionType)
  action!: ModerationActionType;

  @IsOptional()
  @IsString()
  note?: string;
}

export class FlagContentDto {
  @IsString()
  entity_type!: string; // survey | campaign | response | user

  @IsString()
  entity_id!: string;

  @IsString()
  reason!: string;
}
