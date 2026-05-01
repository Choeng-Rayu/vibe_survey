import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WalletProviderInterface } from './wallet-provider.interface';
import axios from 'axios';

// Requirement 12.3: WING mobile wallet integration
@Injectable()
export class WingProvider implements WalletProviderInterface {
  private readonly logger = new Logger(WingProvider.name);
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly merchantId: string;

  constructor(private readonly configService: ConfigService) {
    this.apiUrl = this.configService.get('WING_API_URL', 'https://api.wingmoney.com');
    this.apiKey = this.configService.get('WING_API_KEY', '');
    this.merchantId = this.configService.get('WING_MERCHANT_ID', '');
  }

  async processWithdrawal(params: {
    amount: number;
    currency: string;
    accountId: string;
    reference: string;
  }): Promise<{ success: boolean; transactionRef?: string; error?: string }> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/v1/payout`,
        {
          merchant_code: this.merchantId,
          receiver_phone: params.accountId,
          amount: params.amount,
          currency: params.currency,
          transaction_ref: params.reference,
        },
        {
          headers: {
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data?.status === 'success') {
        return {
          success: true,
          transactionRef: response.data.transaction_id,
        };
      }

      return {
        success: false,
        error: response.data?.message || 'Payout failed',
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`WING withdrawal error: ${message}`);
      return { success: false, error: message };
    }
  }

  async checkStatus(transactionRef: string): Promise<{
    status: 'pending' | 'completed' | 'failed';
    details?: any;
  }> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/v1/payout/status/${transactionRef}`,
        {
          headers: { 'X-API-Key': this.apiKey },
        },
      );

      const status = response.data?.status?.toLowerCase();
      return {
        status: status === 'completed' ? 'completed' : status === 'failed' ? 'failed' : 'pending',
        details: response.data,
      };
    } catch (error) {
      return { status: 'pending' };
    }
  }

  validateAccount(accountId: string): boolean {
    // WING account format: phone number (855xxxxxxxx)
    const phoneRegex = /^855\d{8,9}$/;
    return phoneRegex.test(accountId);
  }
}
