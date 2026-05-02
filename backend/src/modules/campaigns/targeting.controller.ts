import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { TargetingService } from './targeting.service';
import { TargetingCriteriaDto, LookalikeAudienceDto } from './dto/targeting-criteria.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// Requirement 9: Audience Targeting Engine
@Controller('targeting')
@UseGuards(JwtAuthGuard)
export class TargetingController {
  constructor(private readonly targetingService: TargetingService) {}

  // Requirement 9.2: Estimate audience size
  @Post('estimate')
  estimateAudienceSize(@Body() dto: TargetingCriteriaDto) {
    return this.targetingService.estimateAudienceSize(dto);
  }

  // Requirement 9.8: Validate targeting
  @Post('validate')
  validateTargeting(@Body() dto: TargetingCriteriaDto) {
    return this.targetingService.validateTargeting(dto);
  }

  // Requirement 9.1: Get demographic options
  @Get('demographics')
  getDemographics() {
    return this.targetingService.getDemographicOptions();
  }

  // Requirement 9.5: Get interest categories
  @Get('interests')
  getInterests() {
    return this.targetingService.getInterestCategories();
  }

  // Requirement 9.6: Get behavior options
  @Get('behaviors')
  getBehaviors() {
    return this.targetingService.getBehaviorOptions();
  }

  // Requirement 9.7: Create lookalike audience
  @Post('lookalike')
  createLookalikeAudience(@Body() dto: LookalikeAudienceDto) {
    return this.targetingService.createLookalikeAudience(
      dto.source_user_ids,
      dto.similarity_threshold,
    );
  }

  // Requirement 9.10: Get optimization recommendations
  @Post('optimize')
  getOptimizationRecommendations(@Body() dto: TargetingCriteriaDto) {
    return this.targetingService.getOptimizationRecommendations(dto);
  }
}
