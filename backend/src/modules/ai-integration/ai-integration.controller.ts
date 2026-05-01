import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AiIntegrationService } from './ai-integration.service';
import { AiCacheService } from './ai-cache.service';
import { AiPromptDto } from './dto/ai-prompt.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

// Requirement 6.4: Rate limiting (100 requests per hour per user)
@Controller('ai')
@UseGuards(JwtAuthGuard)
@Throttle({ default: { limit: 100, ttl: 3600000 } })
export class AiIntegrationController {
  constructor(
    private readonly aiService: AiIntegrationService,
    private readonly cacheService: AiCacheService,
  ) {}

  @Post('prompt')
  async processPrompt(@CurrentUser('userId') userId: string, @Body() dto: AiPromptDto) {
    // Check cache first
    const cacheKey = this.cacheService.generateKey(userId, dto.prompt, dto.mode);
    const cached = await this.cacheService.get(cacheKey);
    
    if (cached) {
      return { ...cached, cached: true };
    }

    // Process AI request
    const result = await this.aiService.processPrompt(userId, dto);

    // Cache result
    await this.cacheService.set(cacheKey, result);

    return { ...result, cached: false };
  }
}
