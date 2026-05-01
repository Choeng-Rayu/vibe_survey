import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ResponseRepository } from './response.repository';
import { FraudDetectionService } from '../fraud-detection/fraud-detection.service';
import { WalletService } from '../payments/wallet.service';
import { SubmitResponseDto, AutoSaveDto, StartSurveyDto } from './dto/survey-response.dto';
import { ResponseStatus } from '@prisma/client';

// Requirement 10: Survey Taking Engine
// Requirement 26: Survey Response Parser and Validator
@Injectable()
export class ResponseService {
  private readonly logger = new Logger(ResponseService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly responseRepo: ResponseRepository,
    private readonly fraudDetection: FraudDetectionService,
    private readonly walletService: WalletService,
  ) {}

  // Requirement 10.7: Survey completion and submission
  async startSurvey(userId: string, dto: StartSurveyDto) {
    const survey = await this.prisma.survey.findUnique({ where: { id: dto.survey_id } });
    if (!survey) {
      throw new NotFoundException('Survey not found');
    }

    // Check for existing in-progress response
    const existing = await this.responseRepo.findInProgress(userId, dto.survey_id);
    if (existing) {
      return { response_id: existing.id, resumed: true };
    }

    const response = await this.responseRepo.create({
      survey_id: dto.survey_id,
      campaign_id: dto.campaign_id,
      user_id: userId,
      answers: {},
      behavioral_data: {},
    });

    this.logger.log(`Survey started: ${dto.survey_id} by user ${userId}`);
    return { response_id: response.id, resumed: false };
  }

  // Requirement 10.5: Response validation and quality checks
  // Requirement 26.2: Validate required fields
  async submitResponse(userId: string, dto: SubmitResponseDto) {
    const survey = await this.prisma.survey.findUnique({ where: { id: dto.survey_id } });
    if (!survey) {
      throw new NotFoundException('Survey not found');
    }

    // Validate answers against survey definition
    const validation = this.validateAnswers(survey.definition, dto.answers);
    if (!validation.valid) {
      throw new BadRequestException(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Find or create response
    let response = await this.responseRepo.findInProgress(userId, dto.survey_id);
    if (!response) {
      response = await this.responseRepo.create({
        survey_id: dto.survey_id,
        campaign_id: dto.campaign_id,
        user_id: userId,
        answers: dto.answers,
        behavioral_data: dto.behavioral_data || {},
      });
    }

    // Requirement 10.8: Behavioral data collection
    // Requirement 10.9: Attention check validation
    // Requirement 11: Fraud detection with comprehensive analysis
    const fraudAnalysis = await this.fraudDetection.analyzeFraud(
      survey.definition,
      dto.answers,
      dto.behavioral_data,
      userId,
    );

    // Reject if fraud score exceeds threshold
    if (fraudAnalysis.should_reject) {
      throw new BadRequestException('Response rejected due to fraud detection');
    }

    // Update response with completion
    const updated = await this.responseRepo.update(response.id, {
      answers: dto.answers,
      behavioral_data: dto.behavioral_data || {},
      status: ResponseStatus.completed,
      completed_at: new Date(),
      fraud_score: fraudAnalysis.fraud_score,
      fraud_signals: fraudAnalysis.fraud_signals,
      quality_label: fraudAnalysis.quality_label,
      time_spent: Math.round(fraudAnalysis.behavioral_metrics.avg_response_time / 1000),
    });

    // Record spending if campaign exists
    if (dto.campaign_id) {
      await this.recordCampaignSpending(dto.campaign_id, userId);
    }

    this.logger.log(`Response submitted: ${response.id} with fraud score ${fraudAnalysis.fraud_score}`);
    return updated;
  }

  // Requirement 10.6: Auto-save functionality for survey progress
  async autoSave(userId: string, surveyId: string, dto: AutoSaveDto) {
    let response = await this.responseRepo.findInProgress(userId, surveyId);
    
    if (!response) {
      response = await this.responseRepo.create({
        survey_id: surveyId,
        user_id: userId,
        answers: dto.answers,
        behavioral_data: dto.behavioral_data || {},
      });
    } else {
      response = await this.responseRepo.update(response.id, {
        answers: dto.answers,
        behavioral_data: dto.behavioral_data || {},
        time_spent: dto.time_spent,
      });
    }

    return { response_id: response.id, saved_at: new Date() };
  }

  // Requirement 10.10: Survey resume functionality
  async resumeSurvey(userId: string, surveyId: string) {
    const response = await this.responseRepo.findInProgress(userId, surveyId);
    
    if (!response) {
      throw new NotFoundException('No in-progress survey found');
    }

    return {
      response_id: response.id,
      answers: response.answers,
      behavioral_data: response.behavioral_data,
      time_spent: response.time_spent,
      started_at: response.started_at,
    };
  }

  // Requirement 10.4: Branching logic evaluation
  getNextQuestion(surveyDefinition: any, answers: Record<string, any>, currentQuestionId: string) {
    const questions = surveyDefinition.questions || [];
    const currentIndex = questions.findIndex((q: any) => q.id === currentQuestionId);
    
    if (currentIndex === -1) return null;

    const currentQuestion = questions[currentIndex];
    
    // Check for branching logic
    if (currentQuestion.branching_logic) {
      const answer = answers[currentQuestionId];
      const branch = currentQuestion.branching_logic.find((b: any) => 
        b.condition_value === answer || b.condition_values?.includes(answer)
      );
      
      if (branch?.next_question_id) {
        return questions.find((q: any) => q.id === branch.next_question_id);
      }
    }

    // Return next question in sequence
    return currentIndex < questions.length - 1 ? questions[currentIndex + 1] : null;
  }

  // Requirement 26.2: Validate response contains required fields
  private validateAnswers(surveyDefinition: any, answers: Record<string, any>) {
    const errors: string[] = [];
    const questions = surveyDefinition.questions || [];

    for (const question of questions) {
      if (question.required && !answers[question.id]) {
        errors.push(`Question ${question.id} is required`);
      }

      // Validate answer format based on question type
      if (answers[question.id]) {
        const answer = answers[question.id];
        
        if (question.type === 'multiple_choice' && question.max_selections) {
          if (Array.isArray(answer) && answer.length > question.max_selections) {
            errors.push(`Question ${question.id} exceeds max selections`);
          }
        }

        if (question.type === 'rating' && question.scale) {
          if (typeof answer === 'number' && (answer < question.scale.min || answer > question.scale.max)) {
            errors.push(`Question ${question.id} rating out of range`);
          }
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  private async recordCampaignSpending(campaignId: string, userId: string) {
    try {
      const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
      if (!campaign) return;

      const cpr = Number(campaign.cpr);
      const newSpent = Number(campaign.budget_spent) + cpr;
      const newCount = campaign.response_count + 1;

      await this.prisma.campaign.update({
        where: { id: campaignId },
        data: {
          budget_spent: newSpent,
          response_count: newCount,
          ...(newSpent >= Number(campaign.budget_total) && { status: 'completed' }),
        },
      });

      // Award points to user using WalletService
      const points = this.walletService.calculatePoints(cpr);
      const response = await this.responseRepo.findInProgress(userId, campaign.survey_id);
      
      if (response) {
        await this.walletService.awardPoints(
          userId,
          points,
          response.id,
          `Survey completion: ${campaign.title}`,
        );
      }

      this.logger.log(`Campaign spending recorded: ${campaignId}, CPR: ${cpr}, Points: ${points}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to record campaign spending: ${message}`);
    }
  }

  async getUserHistory(userId: string, status?: ResponseStatus) {
    return this.responseRepo.findUserResponses(userId, status);
  }
}
