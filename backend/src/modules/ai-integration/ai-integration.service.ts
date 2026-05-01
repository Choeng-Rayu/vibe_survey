import { Injectable, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiPromptDto } from './dto/ai-prompt.dto';
import { PromptValidationService } from './prompt-validation.service';

// Requirement 6: AI-powered survey generation and enhancement
@Injectable()
export class AiIntegrationService {
  private readonly logger = new Logger(AiIntegrationService.name);
  private readonly aiEndpoint: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly promptValidation: PromptValidationService,
  ) {
    this.aiEndpoint = this.configService.get<string>('AI_ENDPOINT') || 'http://localhost:8000/ai';
  }

  async processPrompt(userId: string, dto: AiPromptDto): Promise<any> {
    this.logger.log(`AI request - Mode: ${dto.mode}, User: ${userId}`);

    // Requirement 6.2 & 28.3: Validate prompt for injection attempts
    const validation = this.promptValidation.validatePrompt(userId, dto.prompt || '');
    
    if (!validation.isValid) {
      this.logger.warn(`Blocked prompt from user ${userId}: ${validation.blockedReasons.join(', ')}`);
      throw new ForbiddenException({
        message: 'Prompt validation failed',
        reasons: validation.blockedReasons,
        riskLevel: validation.riskLevel,
      });
    }

    // Use sanitized prompt
    const sanitizedPrompt = validation.sanitizedPrompt || dto.prompt;

    // Route to appropriate AI agent mode
    switch (dto.mode) {
      case 'generate':
        return this.generateSurvey(sanitizedPrompt, dto.context);
      case 'modify':
        return this.modifySurvey(sanitizedPrompt, dto.context);
      case 'enhance':
        return this.enhanceSurvey(dto.context);
      case 'translate':
        return this.translateSurvey(dto.context, dto.targetLanguage);
      case 'analyze':
        return this.analyzeSurvey(dto.context);
      case 'normalize':
        return this.normalizeSurvey(dto.context);
      default:
        throw new BadRequestException('Invalid AI mode');
    }
  }

  private async generateSurvey(prompt: string, context?: any): Promise<any> {
    // Requirement 6.1: AI survey generation
    this.logger.log(`Generating survey from prompt: ${prompt.substring(0, 50)}...`);
    
    // Mock AI response - replace with actual AI service call
    return {
      mode: 'generate',
      survey: {
        title: 'AI Generated Survey',
        description: `Survey generated from: ${prompt}`,
        definition: {
          questions: [
            { id: 'q1', type: 'text', text: 'Sample question from AI', required: true },
          ],
        },
      },
      diff: null,
    };
  }

  private async modifySurvey(prompt: string, context: any): Promise<any> {
    // Requirement 6.6: Diff generation for AI modifications
    this.logger.log(`Modifying survey with prompt: ${prompt.substring(0, 50)}...`);
    
    return {
      mode: 'modify',
      survey: context,
      diff: {
        added: ['New question added'],
        removed: [],
        modified: [],
      },
    };
  }

  private async enhanceSurvey(context: any): Promise<any> {
    // Requirement 6.5: AI-powered survey enhancement
    this.logger.log('Enhancing survey');
    
    return {
      mode: 'enhance',
      suggestions: [
        { type: 'clarity', message: 'Consider rephrasing question 1 for clarity' },
        { type: 'completeness', message: 'Add demographic questions' },
      ],
    };
  }

  private async translateSurvey(context: any, targetLanguage?: string): Promise<any> {
    // Requirement 6.5: AI-powered translation
    this.logger.log(`Translating survey to: ${targetLanguage}`);
    
    return {
      mode: 'translate',
      survey: context,
      targetLanguage,
    };
  }

  private async analyzeSurvey(context: any): Promise<any> {
    // Requirement 6.9: AI-powered survey analysis
    this.logger.log('Analyzing survey');
    
    return {
      mode: 'analyze',
      analysis: {
        questionCount: context.definition?.questions?.length || 0,
        estimatedTime: 5,
        qualityScore: 85,
      },
    };
  }

  private async normalizeSurvey(context: any): Promise<any> {
    // Normalize imported survey data
    this.logger.log('Normalizing survey');
    
    return {
      mode: 'normalize',
      survey: context,
    };
  }

  generateDiff(original: any, modified: any): any {
    // Requirement 6.6: Diff generation for AI modifications
    const diff: { added: string[]; removed: string[]; modified: string[] } = {
      added: [],
      removed: [],
      modified: [],
    };

    const origQuestions = original.definition?.questions || [];
    const modQuestions = modified.definition?.questions || [];

    if (origQuestions.length !== modQuestions.length) {
      diff.added.push(`Question count changed: ${origQuestions.length} → ${modQuestions.length}`);
    }

    return diff;
  }
}
