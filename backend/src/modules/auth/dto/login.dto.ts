import { IsEmail, IsString, IsOptional } from 'class-validator';

// Requirement 3: User login DTO
export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsOptional()
  @IsString()
  deviceFingerprint?: string;
}
