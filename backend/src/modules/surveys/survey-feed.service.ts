import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  SurveyFeedQueryDto,
  SurveyFeedResponseDto,
  SurveyFeedItemDto,
} from './dto/survey-feed.dto';

// Requirement 10.1: Survey feed generation with personalized recommendations
// Requirement 10.2: Screener question evaluation and qualification
@Injectable()
export class SurveyFeedService {
  private readonly logger = new Logger(SurveyFeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Get personalized survey feed with match scoring
  async getPersonalizedFeed(
    userId: string,
    query: SurveyFeedQueryDto,
  ): Promise<SurveyFeedResponseDto> {
    const limit = query.limit || 20;
    const profile = await this.prisma.profile.findUnique({ where: { user_id: userId } });

    if (!profile) {
      return this.getGenericFeed(query);
    }

    const campaigns = await this.prisma.campaign.findMany({
      where: {
        status: 'active',
        deleted_at: null,
        OR: [{ ends_at: null }, { ends_at: { gte: new Date() } }],
      },
      include: {
        survey: {
          select: {
            id: true,
            title: true,
            description: true,
            estimated_time: true,
            question_count: true,
          },
        },
        responses: { where: { user_id: userId }, select: { id: true } },
      },
      take: limit + 1,
      orderBy: { created_at: 'desc' },
    });

    const eligibleCampaigns = campaigns.filter((c) => {
      if (c.responses.length > 0) return false;
      if (c.max_responses && c.response_count >= c.max_responses) return false;
      const remaining = Number(c.budget_total) - Number(c.budget_spent);
      return remaining >= Number(c.cpr);
    });

    const scoredSurveys = eligibleCampaigns.map((campaign) => {
      const matchScore = this.calculateMatchScore(campaign.targeting, profile);
      return {
        id: campaign.survey.id,
        title: campaign.survey.title,
        description: campaign.survey.description || '',
        estimated_time: campaign.survey.estimated_time || 10,
        reward_points: Math.round(Number(campaign.cpr) * 100),
        match_score: matchScore,
        category: 'general',
        question_count: campaign.survey.question_count,
        campaign_id: campaign.id,
      };
    });

    scoredSurveys.sort((a, b) => {
      if (query.sort_by === 'reward') return b.reward_points - a.reward_points;
      if (query.sort_by === 'estimated_time') return a.estimated_time - b.estimated_time;
      return b.match_score - a.match_score;
    });

    const hasMore = scoredSurveys.length > limit;
    const surveys = hasMore ? scoredSurveys.slice(0, limit) : scoredSurveys;
    const nextCursor = hasMore ? surveys[surveys.length - 1].id : undefined;

    return {
      surveys,
      next_cursor: nextCursor,
      total_available: eligibleCampaigns.length,
    };
  }

  // Generic feed for users without profile
  async getGenericFeed(query: SurveyFeedQueryDto): Promise<SurveyFeedResponseDto> {
    const limit = query.limit || 20;
    const campaigns = await this.prisma.campaign.findMany({
      where: {
        status: 'active',
        deleted_at: null,
        OR: [{ ends_at: null }, { ends_at: { gte: new Date() } }],
      },
      include: {
        survey: {
          select: {
            id: true,
            title: true,
            description: true,
            estimated_time: true,
            question_count: true,
          },
        },
      },
      take: limit + 1,
      orderBy: { created_at: 'desc' },
    });

    const surveys = campaigns.slice(0, limit).map((c) => ({
      id: c.survey.id,
      title: c.survey.title,
      description: c.survey.description || '',
      estimated_time: c.survey.estimated_time || 10,
      reward_points: Math.round(Number(c.cpr) * 100),
      match_score: 50,
      category: 'general',
      question_count: c.survey.question_count,
      campaign_id: c.id,
    }));

    return {
      surveys,
      next_cursor: campaigns.length > limit ? surveys[surveys.length - 1].id : undefined,
      total_available: campaigns.length,
    };
  }

  // Calculate match score based on targeting criteria
  private calculateMatchScore(targeting: any, profile: any): number {
    let score = 0;
    let totalWeight = 0;

    // Demographic matching (40% weight)
    if (targeting.demographics) {
      const demoScore = this.matchDemographics(targeting.demographics, profile);
      score += demoScore * 40;
      totalWeight += 40;
    }

    // Geographic matching (30% weight)
    if (targeting.geographic) {
      const geoScore = this.matchGeographic(targeting.geographic, profile);
      score += geoScore * 30;
      totalWeight += 30;
    }

    // Interest matching (30% weight)
    if (targeting.interests && profile.interests) {
      const interestScore = this.matchInterests(targeting.interests, profile.interests);
      score += interestScore * 30;
      totalWeight += 30;
    }

    return totalWeight > 0 ? Math.round(score / totalWeight) : 50;
  }

  private matchDemographics(targetDemo: any, profile: any): number {
    let matches = 0;
    let total = 0;

    if (targetDemo.age_min || targetDemo.age_max) {
      total++;
      if (profile.date_of_birth) {
        const age = new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear();
        if (
          (!targetDemo.age_min || age >= targetDemo.age_min) &&
          (!targetDemo.age_max || age <= targetDemo.age_max)
        ) {
          matches++;
        }
      }
    }

    if (targetDemo.gender && profile.gender) {
      total++;
      if (targetDemo.gender.includes(profile.gender)) matches++;
    }

    if (targetDemo.education_level && profile.education_level) {
      total++;
      if (targetDemo.education_level.includes(profile.education_level)) matches++;
    }

    if (targetDemo.income_range && profile.income_range) {
      total++;
      if (targetDemo.income_range.includes(profile.income_range)) matches++;
    }

    return total > 0 ? (matches / total) * 100 : 100;
  }

  private matchGeographic(targetGeo: any, profile: any): number {
    if (targetGeo.countries && profile.country) {
      if (targetGeo.countries.includes(profile.country)) return 100;
      return 0;
    }
    if (targetGeo.regions && profile.region) {
      if (targetGeo.regions.includes(profile.region)) return 100;
      return 50;
    }
    if (targetGeo.cities && profile.city) {
      if (targetGeo.cities.includes(profile.city)) return 100;
      return 30;
    }
    return 100;
  }

  private matchInterests(targetInterests: string[], profileInterests: string[]): number {
    if (!targetInterests.length || !profileInterests.length) return 50;
    const matches = targetInterests.filter((i) => profileInterests.includes(i)).length;
    return (matches / targetInterests.length) * 100;
  }

  // Check if user is eligible for survey
  async checkEligibility(
    userId: string,
    campaignId: string,
  ): Promise<{ eligible: boolean; reason?: string }> {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { responses: { where: { user_id: userId }, select: { id: true } } },
    });

    if (!campaign) {
      return { eligible: false, reason: 'Campaign not found' };
    }

    if (campaign.status !== 'active') {
      return { eligible: false, reason: 'Campaign not active' };
    }

    if (campaign.responses.length > 0) {
      return { eligible: false, reason: 'Already completed' };
    }

    if (campaign.max_responses && campaign.response_count >= campaign.max_responses) {
      return { eligible: false, reason: 'Max responses reached' };
    }

    const remaining = Number(campaign.budget_total) - Number(campaign.budget_spent);
    if (remaining < Number(campaign.cpr)) {
      return { eligible: false, reason: 'Budget exhausted' };
    }

    return { eligible: true };
  }

  // Evaluate screener questions
  async evaluateScreener(
    surveyId: string,
    answers: Record<string, any>,
  ): Promise<{ qualified: boolean; reason?: string }> {
    const survey = await this.prisma.survey.findUnique({ where: { id: surveyId } });

    if (!survey) {
      return { qualified: false, reason: 'Survey not found' };
    }

    const definition = survey.definition as any;
    const screeners = definition.questions?.filter((q: any) => q.is_screener) || [];

    if (screeners.length === 0) {
      return { qualified: true };
    }

    for (const screener of screeners) {
      const answer = answers[screener.id];
      if (!answer) {
        return { qualified: false, reason: 'Missing screener answer' };
      }

      if (screener.screener_logic?.disqualify_values) {
        if (screener.screener_logic.disqualify_values.includes(answer)) {
          return { qualified: false, reason: 'Screener criteria not met' };
        }
      }
    }

    return { qualified: true };
  }
}
