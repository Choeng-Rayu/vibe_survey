import { IsString, IsArray, IsOptional, IsBoolean } from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  name!: string;

  @IsString()
  type!: string;

  @IsString()
  subject!: string;

  @IsString()
  body!: string;

  @IsOptional()
  @IsString()
  language?: string; // 'en' or 'km' (Khmer)

  @IsOptional()
  @IsArray()
  variables?: string[];

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateTemplateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsArray()
  variables?: string[];

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
