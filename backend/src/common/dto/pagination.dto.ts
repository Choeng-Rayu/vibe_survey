import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';

// Req 18.7: Cursor-based pagination for large datasets
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  @IsOptional()
  @IsString()
  cursor?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    has_more: boolean;
    next_cursor: string | null;
    total_count?: number;
    limit: number;
  };
}
