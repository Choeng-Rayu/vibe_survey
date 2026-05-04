import { IsNumber, IsString, IsOptional, Min, IsEnum } from 'class-validator';
import { TransactionType } from '@prisma/client';

// Requirement 12.1: Points calculation and wallet management
export class CreateTransactionDto {
  @IsString()
  wallet_id!: string;

  @IsEnum(TransactionType)
  type!: TransactionType;

  @IsNumber()
  @Min(0)
  amount!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  response_id?: string;
}

export class TransactionQueryDto {
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 50;

  @IsOptional()
  @IsString()
  cursor?: string;
}

export interface WalletBalanceDto {
  balance: number;
  points: number;
  currency: string;
  pending_withdrawals: number;
}

export interface TransactionHistoryDto {
  transactions: TransactionItemDto[];
  next_cursor?: string;
  total: number;
}

export interface TransactionItemDto {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  status: string;
  created_at: Date;
}
