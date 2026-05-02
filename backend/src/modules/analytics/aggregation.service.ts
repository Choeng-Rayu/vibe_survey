// Req 13: Response data aggregation and cross-tabulation
import { Injectable } from '@nestjs/common';

@Injectable()
export class AggregationService {
  /** Aggregate responses by date bucket (day/week/month) */
  aggregateByDate(
    responses: Array<{ created_at: Date; completed_at?: Date | null }>,
    groupBy: 'day' | 'week' | 'month',
  ) {
    const buckets = new Map<string, { total: number; completed: number }>();

    for (const r of responses) {
      const key = this.dateBucket(r.created_at, groupBy);
      const existing = buckets.get(key) ?? { total: 0, completed: 0 };
      existing.total++;
      if (r.completed_at) existing.completed++;
      buckets.set(key, existing);
    }

    return Array.from(buckets.entries())
      .map(([date, counts]) => ({
        date,
        ...counts,
        completion_rate: counts.total ? counts.completed / counts.total : 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /** Demographic segmentation from response user profiles */
  aggregateDemographics(
    profiles: Array<{
      gender?: string | null;
      country?: string | null;
      education_level?: string | null;
    }>,
  ) {
    const gender: Record<string, number> = {};
    const country: Record<string, number> = {};
    const education: Record<string, number> = {};

    for (const p of profiles) {
      const g = p.gender ?? 'unknown';
      const c = p.country ?? 'unknown';
      const e = p.education_level ?? 'unknown';
      gender[g] = (gender[g] ?? 0) + 1;
      country[c] = (country[c] ?? 0) + 1;
      education[e] = (education[e] ?? 0) + 1;
    }

    return { gender, country, education };
  }

  /** Calculate core campaign metrics */
  calculateMetrics(campaign: {
    response_count: number;
    max_responses?: number | null;
    budget_total: { toNumber(): number };
    budget_spent: { toNumber(): number };
    cpr: { toNumber(): number };
  }) {
    const total = campaign.response_count;
    const max = campaign.max_responses ?? null;
    const budgetTotal = campaign.budget_total.toNumber();
    const budgetSpent = campaign.budget_spent.toNumber();

    return {
      total_responses: total,
      completion_rate: max ? total / max : null,
      budget_utilization: budgetTotal > 0 ? budgetSpent / budgetTotal : 0,
      cpr: campaign.cpr.toNumber(),
      budget_remaining: budgetTotal - budgetSpent,
    };
  }

  private dateBucket(date: Date, groupBy: 'day' | 'week' | 'month'): string {
    const d = new Date(date);
    if (groupBy === 'month')
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (groupBy === 'week') {
      const startOfWeek = new Date(d);
      startOfWeek.setDate(d.getDate() - d.getDay());
      return startOfWeek.toISOString().slice(0, 10);
    }
    return d.toISOString().slice(0, 10);
  }
}
