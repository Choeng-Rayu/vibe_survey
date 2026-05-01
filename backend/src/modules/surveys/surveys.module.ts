import { Module } from '@nestjs/common';
import { SurveysController } from './surveys.controller';
import { SurveysService } from './surveys.service';
import { SurveysRepository } from './surveys.repository';
import { SurveyValidationService } from './survey-validation.service';
import { SurveyVersioningService } from './survey-versioning.service';
import { TemplateService } from './template.service';
import { QuestionBankService } from './question-bank.service';
import { SurveyImportExportService } from './survey-import-export.service';
import { SurveyFeedService } from './survey-feed.service';
import { ResponseService } from './response.service';
import { ResponseRepository } from './response.repository';
import { DatabaseModule } from '../../database/database.module';
import { FraudDetectionModule } from '../fraud-detection/fraud-detection.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [DatabaseModule, FraudDetectionModule, PaymentsModule],
  controllers: [SurveysController],
  providers: [SurveysService, SurveysRepository, SurveyValidationService, SurveyVersioningService, TemplateService, QuestionBankService, SurveyImportExportService, SurveyFeedService, ResponseService, ResponseRepository],
  exports: [SurveysService],
})
export class SurveysModule {}
