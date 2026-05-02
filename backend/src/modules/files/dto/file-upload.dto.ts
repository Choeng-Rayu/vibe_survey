// Req 24: File Storage and Management
import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';

export enum StorageType {
  LOCAL = 'local',
  S3 = 's3',
  R2 = 'r2',
}

export class FileUploadDto {
  @IsString()
  filename!: string;

  @IsString()
  mime_type!: string;

  @IsOptional()
  @IsEnum(StorageType)
  storage_type?: StorageType = StorageType.LOCAL;

  @IsOptional()
  @IsBoolean()
  is_temporary?: boolean = false;
}
