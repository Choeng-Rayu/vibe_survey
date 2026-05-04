// Requirement 19: API Key Management DTOs
import { IsString, IsArray, IsOptional, IsDateString } from 'class-validator';

export class CreateApiKeyDto {
  @IsString()
  name!: string;

  @IsArray()
  @IsString({ each: true })
  scopes!: string[];

  @IsOptional()
  @IsDateString()
  expires_at?: string;
}

export class ApiKeyResponseDto {
  id!: string;
  name!: string;
  key_prefix!: string;
  scopes!: string[];
  last_used_at?: Date | null;
  expires_at?: Date | null;
  created_at!: Date;
}

export class ApiKeyWithSecretDto extends ApiKeyResponseDto {
  key!: string; // Only returned on creation
}
