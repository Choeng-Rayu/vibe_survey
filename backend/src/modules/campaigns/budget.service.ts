import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

// Requirement 8.6: Campaign budget management and monitoring
@Injectable()
export class BudgetService {
  private readonly logger = new Logger(BudgetService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Get campaign budget details
  async getBudget(campaignId: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      select: {
        budget_total: true,
        budget_spent: true,
        cpr: true,
        max_responses: true,
        response_count: true,
      },
    });

    if (!campaign) {
      throw new BadRequestException('Campaign not found');
    }

    const budgetTotal = Number(campaign.budget_total);
    const budgetSpent = Number(campaign.budget_spent);
    const remaining = budgetTotal - budgetSpent;
    const percentSpent = budgetTotal > 0 ? (budgetSpent / budgetTotal) * 100 : 0;

    return {
      budget_total: budgetTotal,
      budget_spent: budgetSpent,
      budget_remaining: remaining,
      percent_spent: Math.round(percentSpent * 100) / 100,
      cpr: Number(campaign.cpr),
      max_responses: campaign.max_responses,
      response_count: campaign.response_count,
      estimated_responses_remaining: this.estimateRemainingResponses(
        remaining,
        Number(campaign.cpr),
      ),
    };
  }

  // Update campaign budget
  async updateBudget(campaignId: string, budgetTotal: number, cpr: number, maxResponses?: number) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      select: { budget_spent: true, status: true },
    });

    if (!campaign) {
      throw new BadRequestException('Campaign not found');
    }

    if (budgetTotal < Number(campaign.budget_spent)) {
      throw new BadRequestException('New budget cannot be less than amount already spent');
    }

    if (campaign.status === 'active') {
      throw new BadRequestException('Cannot modify budget of active campaign');
    }

    await this.prisma.campaign.update({
      where: { id: campaignId },
      data: { budget_total: budgetTotal, cpr, max_responses: maxResponses },
    });

    this.logger.log(`Budget updated for campaign ${campaignId}: ${budgetTotal}`);
    return this.getBudget(campaignId);
  }

  // Top up campaign budget
  async topUpBudget(campaignId: string, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('Top-up amount must be positive');
    }

    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      select: { budget_total: true },
    });

    if (!campaign) {
      throw new BadRequestException('Campaign not found');
    }

    const newTotal = Number(campaign.budget_total) + amount;

    await this.prisma.campaign.update({
      where: { id: campaignId },
      data: { budget_total: newTotal },
    });

    this.logger.log(`Budget topped up for campaign ${campaignId}: +${amount}`);
    return this.getBudget(campaignId);
  }

  // Record spending when response is submitted
  async recordSpending(campaignId: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      select: {
        cpr: true,
        budget_total: true,
        budget_spent: true,
        max_responses: true,
        response_count: true,
      },
    });

    if (!campaign) {
      throw new BadRequestException('Campaign not found');
    }

    const cpr = Number(campaign.cpr);
    const newSpent = Number(campaign.budget_spent) + cpr;
    const newCount = campaign.response_count + 1;

    if (newSpent > Number(campaign.budget_total)) {
      throw new BadRequestException('Budget exceeded');
    }

    if (campaign.max_responses && newCount > campaign.max_responses) {
      throw new BadRequestException('Max responses reached');
    }

    await this.prisma.campaign.update({
      where: { id: campaignId },
      data: { budget_spent: newSpent, response_count: newCount },
    });

    // Auto-complete if budget/responses exhausted
    if (
      newSpent >= Number(campaign.budget_total) ||
      (campaign.max_responses && newCount >= campaign.max_responses)
    ) {
      await this.prisma.campaign.update({
        where: { id: campaignId },
        data: { status: 'completed' },
      });
      this.logger.warn(`Campaign ${campaignId} completed - budget/responses exhausted`);
    }

    return { spent: newSpent, response_count: newCount };
  }

  // Check if campaign has sufficient budget
  async checkBudgetAvailable(campaignId: string): Promise<boolean> {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      select: {
        budget_total: true,
        budget_spent: true,
        cpr: true,
        max_responses: true,
        response_count: true,
      },
    });

    if (!campaign) return false;

    const remaining = Number(campaign.budget_total) - Number(campaign.budget_spent);
    const hasBudget = remaining >= Number(campaign.cpr);
    const hasResponsesLeft =
      !campaign.max_responses || campaign.response_count < campaign.max_responses;

    return hasBudget && hasResponsesLeft;
  }

  // Get budget alerts
  async getBudgetAlerts(campaignId: string) {
    const budget = await this.getBudget(campaignId);
    const alerts: string[] = [];

    if (budget.percent_spent >= 90) {
      alerts.push('Budget is 90% depleted');
    } else if (budget.percent_spent >= 75) {
      alerts.push('Budget is 75% depleted');
    } else if (budget.percent_spent >= 50) {
      alerts.push('Budget is 50% depleted');
    }

    if (budget.max_responses && budget.response_count >= budget.max_responses * 0.9) {
      alerts.push('90% of max responses reached');
    }

    return { alerts, budget };
  }

  // Forecast budget completion
  async forecastBudget(campaignId: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      select: {
        budget_total: true,
        budget_spent: true,
        cpr: true,
        response_count: true,
        created_at: true,
      },
    });

    if (!campaign || campaign.response_count === 0) {
      return { forecast: 'Insufficient data for forecast' };
    }

    const daysActive = Math.max(
      1,
      Math.floor((Date.now() - campaign.created_at.getTime()) / (1000 * 60 * 60 * 24)),
    );
    const responsesPerDay = campaign.response_count / daysActive;
    const remaining = Number(campaign.budget_total) - Number(campaign.budget_spent);
    const responsesRemaining = Math.floor(remaining / Number(campaign.cpr));
    const daysRemaining = Math.round((responsesRemaining / responsesPerDay) * 10) / 10;

    return {
      responses_per_day: Math.round(responsesPerDay * 10) / 10,
      estimated_responses_remaining: responsesRemaining,
      estimated_days_remaining: daysRemaining,
      estimated_completion_date: new Date(Date.now() + daysRemaining * 24 * 60 * 60 * 1000),
    };
  }

  // Budget reconciliation
  async reconcileBudget(campaignId: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { responses: { select: { id: true } } },
    });

    if (!campaign) {
      throw new BadRequestException('Campaign not found');
    }

    const actualResponseCount = campaign.responses.length;
    const expectedSpent = Number(campaign.cpr) * actualResponseCount;
    const actualSpent = Number(campaign.budget_spent);
    const discrepancy = actualSpent - expectedSpent;

    if (Math.abs(discrepancy) > 0.01) {
      this.logger.warn(`Budget discrepancy for campaign ${campaignId}: ${discrepancy}`);

      await this.prisma.campaign.update({
        where: { id: campaignId },
        data: {
          budget_spent: expectedSpent,
          response_count: actualResponseCount,
        },
      });
    }

    return {
      expected_spent: expectedSpent,
      actual_spent: actualSpent,
      discrepancy: Math.round(discrepancy * 100) / 100,
      corrected: Math.abs(discrepancy) > 0.01,
    };
  }

  private estimateRemainingResponses(remaining: number, cpr: number): number {
    if (cpr === 0) return 0;
    return Math.floor(remaining / cpr);
  }
}
