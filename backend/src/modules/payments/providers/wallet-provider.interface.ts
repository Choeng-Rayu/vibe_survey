// Requirement 12.3: Mobile wallet provider interface
export interface WalletProviderInterface {
  processWithdrawal(params: {
    amount: number;
    currency: string;
    accountId: string;
    reference: string;
  }): Promise<{
    success: boolean;
    transactionRef?: string;
    error?: string;
  }>;

  checkStatus(transactionRef: string): Promise<{
    status: 'pending' | 'completed' | 'failed';
    details?: any;
  }>;

  validateAccount(accountId: string): boolean;
}
