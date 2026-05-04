import { IsString } from 'class-validator';

export class OAuthCallbackDto {
  @IsString()
  provider!: string;

  @IsString()
  code!: string;
}
