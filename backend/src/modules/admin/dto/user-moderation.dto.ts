// Req 14.3: User Account Management
import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';

export enum UserAction {
  SUSPEND = 'suspend',
  BAN = 'ban',
  UNSUSPEND = 'unsuspend',
  UNBAN = 'unban',
}

export class UserModerationDto {
  @IsEnum(UserAction)
  action!: UserAction;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class BulkUserActionDto {
  @IsArray()
  @IsString({ each: true })
  user_ids!: string[];

  @IsEnum(UserAction)
  action!: UserAction;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class UserExportDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  user_ids?: string[];

  @IsOptional()
  @IsString()
  format?: 'json' | 'csv' = 'json';
}
