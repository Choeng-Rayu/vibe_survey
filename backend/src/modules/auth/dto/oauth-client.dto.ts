import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';

export class RegisterOAuthClientDto {
  @IsString()
  name!: string;

  @IsUrl()
  redirect_uri!: string;

  @IsArray()
  @IsString({ each: true })
  scopes!: string[];
}

export class AuthorizeOAuthDto {
  @IsString()
  client_id!: string;

  @IsUrl()
  redirect_uri!: string;

  @IsArray()
  @IsString({ each: true })
  scopes!: string[];

  @IsOptional()
  @IsString()
  state?: string;
}

export class OAuthTokenDto {
  @IsString()
  grant_type!: 'authorization_code' | 'refresh_token';

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  refresh_token?: string;

  @IsString()
  client_id!: string;

  @IsString()
  client_secret!: string;
}
