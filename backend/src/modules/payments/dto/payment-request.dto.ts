import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaymentGatewayProvider, PaymentMethodType } from '@prisma/client';

// Requirement 17.3: Multiple payment methods with PCI-safe token inputs
export class CreatePaymentRequestDto {
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsString()
  currency: string = 'USD';

  @IsEnum(PaymentMethodType)
  method!: PaymentMethodType;

  @IsOptional()
  @IsEnum(PaymentGatewayProvider)
  provider?: PaymentGatewayProvider;

  // PCI compliance: accept tokenized payment data only (Req 17.2)
  @IsOptional()
  @IsString()
  payment_token?: string;

  @IsOptional()
  @IsString()
  bank_reference?: string;
}

export class RefundPaymentRequestDto {
  @IsString()
  payment_id!: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  amount?: number;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class PaymentHistoryQueryDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 50;

  @IsOptional()
  @IsString()
  cursor?: string;
}

export class AddPaymentMethodDto {
  @IsEnum(PaymentMethodType)
  method_type!: PaymentMethodType;

  @IsEnum(PaymentGatewayProvider)
  provider!: PaymentGatewayProvider;

  @IsString()
  token_ref!: string;

  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsString()
  last4?: string;

  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}
