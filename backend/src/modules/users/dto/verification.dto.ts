import { IsString, Length } from 'class-validator';

export class VerifyEmailDto {
  @IsString()
  token!: string;
}

export class VerifyPhoneDto {
  @IsString()
  @Length(6, 6)
  otp!: string;
}
