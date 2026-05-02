import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TargetingCriteriaDto } from './dto/targeting-criteria.dto';

// Requirement 9: Audience Targeting Engine
@Injectable()
export class TargetingService {
  private readonly logger = new Logger(TargetingService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Requirement 9.2: Real-time audience size estimation
  async estimateAudienceSize(
    criteria: TargetingCriteriaDto,
  ): Promise<{ estimatedSize: number; criteria: any }> {
    const where = this.buildWhereClause(criteria);
    const count = await this.prisma.profile.count({ where });

    this.logger.log(`Audience size estimated: ${count} users`);
    return { estimatedSize: count, criteria };
  }

  // Requirement 9.3: Complex targeting logic with AND/OR operators
  private buildWhereClause(criteria: TargetingCriteriaDto): any {
    const conditions: any[] = [];

    // Requirement 9.1: Demographic targeting
    if (criteria.demographics) {
      const demo: any = {};

      if (criteria.demographics.age_min || criteria.demographics.age_max) {
        const now = new Date();
        if (criteria.demographics.age_max) {
          const minDate = new Date(
            now.getFullYear() - criteria.demographics.age_max - 1,
            now.getMonth(),
            now.getDate(),
          );
          demo.date_of_birth = { gte: minDate };
        }
        if (criteria.demographics.age_min) {
          const maxDate = new Date(
            now.getFullYear() - criteria.demographics.age_min,
            now.getMonth(),
            now.getDate(),
          );
          demo.date_of_birth = { ...demo.date_of_birth, lte: maxDate };
        }
      }

      if (criteria.demographics.gender?.length) {
        demo.gender = { in: criteria.demographics.gender };
      }

      if (criteria.demographics.education_level?.length) {
        demo.education_level = { in: criteria.demographics.education_level };
      }

      if (criteria.demographics.income_range?.length) {
        demo.income_range = { in: criteria.demographics.income_range };
      }

      if (Object.keys(demo).length > 0) conditions.push(demo);
    }

    // Requirement 9.4: Geographic targeting
    if (criteria.geographic) {
      const geo: any = {};

      if (criteria.geographic.countries?.length) {
        geo.country = { in: criteria.geographic.countries };
      }

      if (criteria.geographic.regions?.length) {
        geo.region = { in: criteria.geographic.regions };
      }

      if (criteria.geographic.cities?.length) {
        geo.city = { in: criteria.geographic.cities };
      }

      if (Object.keys(geo).length > 0) conditions.push(geo);
    }

    // Requirement 9.5: Interest-based targeting
    if (criteria.interests?.length) {
      conditions.push({
        interests: { hasSome: criteria.interests },
      });
    }

    // Requirement 9.3: Apply AND/OR logic
    if (conditions.length === 0) return {};
    if (criteria.logic === 'OR') return { OR: conditions };
    return { AND: conditions };
  }

  // Requirement 9.8: Targeting validation and conflict detection
  async validateTargeting(
    criteria: TargetingCriteriaDto,
  ): Promise<{ isValid: boolean; conflicts: string[] }> {
    const conflicts: string[] = [];

    // Check for conflicting age ranges
    if (criteria.demographics?.age_min && criteria.demographics?.age_max) {
      if (criteria.demographics.age_min > criteria.demographics.age_max) {
        conflicts.push('Minimum age cannot be greater than maximum age');
      }
    }

    // Check if targeting is too narrow
    const size = await this.estimateAudienceSize(criteria);
    if (size.estimatedSize === 0) {
      conflicts.push('Targeting criteria results in zero audience');
    }

    return { isValid: conflicts.length === 0, conflicts };
  }

  // Requirement 9.2: Get demographic options
  async getDemographicOptions() {
    return {
      genders: ['male', 'female', 'other', 'prefer_not_to_say'],
      education_levels: ['high_school', 'bachelors', 'masters', 'doctorate', 'other'],
      income_ranges: ['0-20k', '20k-40k', '40k-60k', '60k-100k', '100k+'],
    };
  }

  // Requirement 9.5: Get interest categories
  async getInterestCategories() {
    return {
      categories: [
        'technology',
        'sports',
        'entertainment',
        'fashion',
        'food',
        'travel',
        'health',
        'finance',
        'education',
        'gaming',
        'music',
        'art',
        'politics',
        'science',
        'business',
      ],
    };
  }

  // Requirement 9.6: Get behavior options
  async getBehaviorOptions() {
    return {
      behaviors: [
        'frequent_survey_taker',
        'high_quality_responses',
        'mobile_user',
        'desktop_user',
        'early_adopter',
        'engaged_user',
      ],
    };
  }

  // Requirement 9.7: Create lookalike audience
  async createLookalikeAudience(sourceUserIds: string[], similarityThreshold: number = 0.7) {
    // Get profiles of source users
    const sourceProfiles = await this.prisma.profile.findMany({
      where: { user_id: { in: sourceUserIds } },
    });

    if (sourceProfiles.length === 0) {
      return { lookalike_audience_id: null, size: 0, criteria: {} };
    }

    // Extract common characteristics
    const commonInterests = this.findCommonInterests(sourceProfiles);
    const commonCountries = this.findCommonValues(sourceProfiles, 'country');
    const commonEducation = this.findCommonValues(sourceProfiles, 'education_level');

    const criteria: TargetingCriteriaDto = {
      interests: commonInterests,
      geographic: { countries: commonCountries },
      demographics: { education_level: commonEducation },
      logic: 'OR',
    };

    const size = await this.estimateAudienceSize(criteria);

    this.logger.log(`Lookalike audience created: ${size.estimatedSize} users`);
    return {
      lookalike_audience_id: `lookalike_${Date.now()}`,
      size: size.estimatedSize,
      criteria,
    };
  }

  // Requirement 9.10: Targeting optimization recommendations
  async getOptimizationRecommendations(criteria: TargetingCriteriaDto) {
    const recommendations: string[] = [];
    const size = await this.estimateAudienceSize(criteria);

    if (size.estimatedSize < 100) {
      recommendations.push(
        'Audience size is very small. Consider broadening your targeting criteria.',
      );
    }

    if (size.estimatedSize > 100000) {
      recommendations.push(
        'Audience size is very large. Consider narrowing your targeting for better relevance.',
      );
    }

    if (!criteria.interests || criteria.interests.length === 0) {
      recommendations.push('Add interest-based targeting to improve response quality.');
    }

    if (!criteria.demographics) {
      recommendations.push('Add demographic targeting to reach your ideal audience.');
    }

    return { recommendations, currentSize: size.estimatedSize };
  }

  private findCommonInterests(profiles: any[]): string[] {
    const interestCounts = new Map<string, number>();

    profiles.forEach((profile) => {
      profile.interests?.forEach((interest: string) => {
        interestCounts.set(interest, (interestCounts.get(interest) || 0) + 1);
      });
    });

    const threshold = profiles.length * 0.5;
    return Array.from(interestCounts.entries())
      .filter(([_, count]) => count >= threshold)
      .map(([interest]) => interest);
  }

  private findCommonValues(profiles: any[], field: string): string[] {
    const valueCounts = new Map<string, number>();

    profiles.forEach((profile) => {
      const value = profile[field];
      if (value) {
        valueCounts.set(value, (valueCounts.get(value) || 0) + 1);
      }
    });

    const threshold = profiles.length * 0.3;
    return Array.from(valueCounts.entries())
      .filter(([_, count]) => count >= threshold)
      .map(([value]) => value);
  }
}
