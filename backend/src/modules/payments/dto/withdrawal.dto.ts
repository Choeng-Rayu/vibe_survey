import { IsNumber, IsString, IsEnum, Min } from 'class-validator';
import { WalletProvider } from '@prisma/client';

// Requirement 12.2: Support multiple payout methods
// Requirement 12.3: Mobile wallet integration (Bakong prioritized)
export class CreateWithdrawalDto {
  @IsNumber()
  @Min(1)
  amount!: number;

  @IsEnum(WalletProvider)
  provider!: WalletProvider;

  @IsString()
  provider_account!: string; // Bakong ID, phone number, or account ID

  @IsString()
  currency: string = 'USD';
}

export interface WithdrawalDto {
  id: string;
  amount: number;
  currency: string;
  provider: WalletProvider;
  provider_account: string;
  status: string;
  failure_reason?: string;
  created_at: Date;
  processed_at?: Date;
}
