import { IsString } from 'class-validator';

// Requirement 3: Token refresh DTO
export class RefreshTokenDto {
  @IsString()
  refreshToken!: string;
}
