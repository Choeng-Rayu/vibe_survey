import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WalletProviderInterface } from './wallet-provider.interface';
import axios from 'axios';

// Requirement 12.3: TrueMoney mobile wallet integration
@Injectable()
export class TrueMoneyProvider implements WalletProviderInterface {
  private readonly logger = new Logger(TrueMoneyProvider.name);
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly merchantId: string;

  constructor(private readonly configService: ConfigService) {
    this.apiUrl = this.configService.get('TRUEMONEY_API_URL', 'https://api.truemoney.com.kh');
    this.apiKey = this.configService.get('TRUEMONEY_API_KEY', '');
    this.merchantId = this.configService.get('TRUEMONEY_MERCHANT_ID', '');
  }

  async processWithdrawal(params: {
    amount: number;
    currency: string;
    accountId: string;
    reference: string;
  }): Promise<{ success: boolean; transactionRef?: string; error?: string }> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/api/v1/transfer`,
        {
          merchant_id: this.merchantId,
          mobile_number: params.accountId,
          amount: params.amount,
          currency: params.currency,
          reference_id: params.reference,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data?.code === '0000') {
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
      this.logger.error(`TrueMoney withdrawal error: ${message}`);
      return { success: false, error: message };
    }
  }

  async checkStatus(transactionRef: string): Promise<{
    status: 'pending' | 'completed' | 'failed';
    details?: any;
  }> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/api/v1/transfer/status`,
        {
          params: { transaction_id: transactionRef },
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
    // TrueMoney account format: phone number (855xxxxxxxx)
    const phoneRegex = /^855\d{8,9}$/;
    return phoneRegex.test(accountId);
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.merchantId);
  }
}
