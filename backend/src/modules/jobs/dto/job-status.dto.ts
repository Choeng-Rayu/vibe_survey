// Req 23: Background Job Processing
import { IsString, IsOptional, IsEnum, IsObject } from 'class-validator';

export enum JobStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  FAILED = 'failed',
  DELAYED = 'delayed',
}

export class JobStatusDto {
  @IsString()
  id!: string;

  @IsEnum(JobStatus)
  status!: JobStatus;

  @IsOptional()
  @IsObject()
  data?: any;

  @IsOptional()
  @IsString()
  error?: string;

  @IsOptional()
  progress?: number;
}
