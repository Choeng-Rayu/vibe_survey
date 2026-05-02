// Req 18.7: Pagination for large datasets
export interface PaginationParams {
  limit?: number;
  cursor?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    hasMore: boolean;
    nextCursor?: string;
    total?: number;
  };
}

export class PaginationHelper {
  static readonly DEFAULT_LIMIT = 20;
  static readonly MAX_LIMIT = 100;

  static getLimit(limit?: number): number {
    if (!limit) return this.DEFAULT_LIMIT;
    return Math.min(limit, this.MAX_LIMIT);
  }

  static buildResult<T extends { id: string }>(
    data: T[],
    limit: number,
    total?: number,
  ): PaginatedResult<T> {
    const hasMore = data.length > limit;
    const items = hasMore ? data.slice(0, limit) : data;
    const nextCursor = hasMore ? items[items.length - 1]?.id : undefined;

    return {
      data: items,
      meta: {
        hasMore,
        nextCursor,
        total,
      },
    };
  }
}
