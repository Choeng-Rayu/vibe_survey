import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WalletProviderInterface } from './wallet-provider.interface';
import axios from 'axios';

// Requirement 12.3: ABA Pay mobile wallet integration
@Injectable()
export class AbaPayProvider implements WalletProviderInterface {
  private readonly logger = new Logger(AbaPayProvider.name);
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly merchantId: string;

  constructor(private readonly configService: ConfigService) {
    this.apiUrl = this.configService.get('ABA_PAY_API_URL', 'https://api.ababank.com');
    this.apiKey = this.configService.get('ABA_PAY_API_KEY', '');
    this.merchantId = this.configService.get('ABA_PAY_MERCHANT_ID', '');
  }

  async processWithdrawal(params: {
    amount: number;
    currency: string;
    accountId: string;
    reference: string;
  }): Promise<{ success: boolean; transactionRef?: string; error?: string }> {
    try {
      // ABA Pay API integration
      const response = await axios.post(
        `${this.apiUrl}/v1/transfers`,
        {
          merchant_id: this.merchantId,
          to_account: params.accountId,
          amount: params.amount,
          currency: params.currency,
          reference: params.reference,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data?.success) {
        return {
          success: true,
          transactionRef: response.data.transaction_id,
        };
      }

      return {
        success: false,
        error: response.data?.message || 'Transfer failed',
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`ABA Pay withdrawal error: ${message}`);
      return { success: false, error: message };
    }
  }

  async checkStatus(transactionRef: string): Promise<{
    status: 'pending' | 'completed' | 'failed';
    details?: any;
  }> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/v1/transfers/${transactionRef}`,
        {
          headers: { 'Authorization': `Bearer ${this.apiKey}` },
        },
      );

      const status = response.data?.status?.toLowerCase();
      return {
        status: status === 'success' ? 'completed' : status === 'failed' ? 'failed' : 'pending',
        details: response.data,
      };
    } catch (error) {
      return { status: 'pending' };
    }
  }

  validateAccount(accountId: string): boolean {
    // ABA Pay account format: phone number or account number
    const phoneRegex = /^855\d{8,9}$/;
    const accountRegex = /^\d{10,16}$/;
    return phoneRegex.test(accountId) || accountRegex.test(accountId);
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.merchantId);
  }
}
