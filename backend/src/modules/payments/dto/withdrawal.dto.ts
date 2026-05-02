import { WalletProvider } from '@prisma/client';

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
