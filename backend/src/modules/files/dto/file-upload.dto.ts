import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class FileUploadDto {
  @IsString()
  filename!: string;

  @IsOptional()
  @IsString()
  originalName?: string;

  @IsString()
  mimetype!: string;

  @IsOptional()
  @IsString()
  storage?: 'local' | 's3' | 'r2';

  @IsOptional()
  @IsBoolean()
  isTemporary?: boolean;
}
