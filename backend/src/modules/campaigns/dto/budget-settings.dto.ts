import { IsNumber, IsOptional, Min } from 'class-validator';

// Requirement 8.6: Budget management DTOs
export class UpdateBudgetDto {
  @IsNumber()
  @Min(0)
  budget_total!: number;

  @IsNumber()
  @Min(0)
  cpr!: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  max_responses?: number;
}

export class TopUpBudgetDto {
  @IsNumber()
  @Min(0.01)
  amount!: number;
}
