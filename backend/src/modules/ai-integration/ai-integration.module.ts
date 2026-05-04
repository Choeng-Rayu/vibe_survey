import { Module } from '@nestjs/common';
import { AiIntegrationController } from './ai-integration.controller';
import { AiIntegrationService } from './ai-integration.service';
import { AiCacheService } from './ai-cache.service';
import { PromptValidationService } from './prompt-validation.service';

@Module({
  controllers: [AiIntegrationController],
  providers: [AiIntegrationService, AiCacheService, PromptValidationService],
  exports: [AiIntegrationService, PromptValidationService],
})
export class AiIntegrationModule {}
