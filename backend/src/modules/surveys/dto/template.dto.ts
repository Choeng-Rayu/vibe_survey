import { IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  category!: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}

export class CreateQuestionBankDto {
  @IsString()
  title!: string;

  @IsString()
  type!: string;

  @IsOptional()
  definition!: any;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  is_public?: boolean;
}
