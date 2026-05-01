import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';

// Bakong KHQR Payment Integration
// Based on: https://github.com/Choeng-Rayu/-bakong_js
@Injectable()
export class BakongService {
  private readonly logger = new Logger(BakongService.name);
  private readonly apiUrl: string;
  private readonly merchantId: string;
  private readonly phoneNumber: string;
  private readonly developerToken: string;
  private readonly merchantName: string;
  private readonly merchantCity: string;

  constructor(private readonly configService: ConfigService) {
    this.apiUrl = this.configService.get('BAKONG_API_URL', 'https://api-bakong.nbc.gov.kh/v1');
    this.merchantId = this.configService.get('BAKONG_MERCHANT_ID') || '';
    this.phoneNumber = this.configService.get('BAKONG_PHONE_NUMBER') || '';
    this.developerToken = this.configService.get('BAKONG_DEVELOPER_TOKEN') || '';
    this.merchantName = this.configService.get('BAKONG_MERCHANT_NAME', 'Vibe Survey');
    this.merchantCity = this.configService.get('BAKONG_MERCHANT_CITY', 'Phnom Penh');
  }

  // Create KHQR QR code for payment
  createKHQR(params: {
    amount: number;
    currency: string;
    billNumber: string;
    storeLabel?: string;
    terminalLabel?: string;
  }): string {
    const {
      amount,
      currency,
      billNumber,
      storeLabel = 'Vibe Survey',
      terminalLabel = 'ONLINE',
    } = params;

    // EMV KHQR format
    const qrData = [
      '00', '02', '01', // Payload Format Indicator
      '01', '12', // Point of Initiation Method (12 = dynamic)
      '29', this.merchantId.length.toString().padStart(2, '0'), this.merchantId, // Merchant Account
      '52', '04', '5999', // Merchant Category Code
      '53', '03', currency, // Transaction Currency
      '54', amount.toString().length.toString().padStart(2, '0'), amount.toFixed(2), // Transaction Amount
      '58', '02', 'KH', // Country Code
      '59', this.merchantName.length.toString().padStart(2, '0'), this.merchantName, // Merchant Name
      '60', this.merchantCity.length.toString().padStart(2, '0'), this.merchantCity, // Merchant City
      '62', // Additional Data
      [
        '01', billNumber.length.toString().padStart(2, '0'), billNumber, // Bill Number
        '07', storeLabel.length.toString().padStart(2, '0'), storeLabel, // Store Label
        '08', terminalLabel.length.toString().padStart(2, '0'), terminalLabel, // Terminal Label
      ].join(''),
    ].join('');

    // Calculate CRC
    const crc = this.calculateCRC(qrData + '6304');
    return qrData + '63' + '04' + crc;
  }

  // Generate MD5 hash for tracking
  generateMD5(qrCode: string): string {
    return crypto.createHash('md5').update(qrCode).digest('hex');
  }

  // Check payment status via Bakong API
  async checkPayment(md5Hash: string): Promise<{
    status: 'PENDING' | 'PAID' | 'FAILED';
    data?: any;
  }> {
    try {
      const response = await axios.get(`${this.apiUrl}/check_transaction_by_hash`, {
        params: { hash: md5Hash },
        headers: {
          Authorization: `Bearer ${this.developerToken}`,
        },
      });

      if (response.data && response.data.responseCode === 0) {
        return {
          status: 'PAID',
          data: response.data.data,
        };
      }

      return { status: 'PENDING' };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Bakong API error: ${message}`);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return { status: 'PENDING' };
        }
        if (error.response?.status === 403) {
          throw new BadRequestException('Bakong API access denied. Check IP whitelist.');
        }
      }
      
      throw new BadRequestException('Failed to check payment status');
    }
  }

  // Process withdrawal to Bakong account
  async processWithdrawal(params: {
    amount: number;
    currency: string;
    bakongId: string;
    description: string;
  }): Promise<{
    success: boolean;
    transactionRef?: string;
    error?: string;
  }> {
    try {
      // Note: Actual withdrawal API endpoint depends on Bakong's merchant API
      // This is a placeholder for the withdrawal flow
      const response = await axios.post(
        `${this.apiUrl}/transfer`,
        {
          fromAccount: this.merchantId,
          toAccount: params.bakongId,
          amount: params.amount,
          currency: params.currency,
          description: params.description,
        },
        {
          headers: {
            Authorization: `Bearer ${this.developerToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data && response.data.responseCode === 0) {
        return {
          success: true,
          transactionRef: response.data.data?.transactionId,
        };
      }

      return {
        success: false,
        error: response.data?.message || 'Transfer failed',
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Bakong withdrawal error: ${message}`);
      
      return {
        success: false,
        error: message,
      };
    }
  }

  // Calculate CRC16 checksum for KHQR
  private calculateCRC(data: string): string {
    let crc = 0xFFFF;
    const polynomial = 0x1021;

    for (let i = 0; i < data.length; i++) {
      crc ^= data.charCodeAt(i) << 8;
      
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x8000) !== 0) {
          crc = (crc << 1) ^ polynomial;
        } else {
          crc = crc << 1;
        }
      }
    }

    crc = crc & 0xFFFF;
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }

  // Validate Bakong ID format
  validateBakongId(bakongId: string): boolean {
    // Bakong ID format: phone number or account@bank
    const phoneRegex = /^855\d{8,9}$/;
    const accountRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+$/;
    
    return phoneRegex.test(bakongId) || accountRegex.test(bakongId);
  }
}
