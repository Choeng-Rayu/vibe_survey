import { Module } from '@nestjs/common';
import { FraudDetectionService } from './fraud-detection.service';
import { BehavioralAnalysisService } from './behavioral-analysis.service';
import { PatternDetectionService } from './pattern-detection.service';
import { DatabaseModule } from '../../database/database.module';

// Requirement 11: Fraud Detection System
@Module({
  imports: [DatabaseModule],
  providers: [FraudDetectionService, BehavioralAnalysisService, PatternDetectionService],
  exports: [FraudDetectionService],
})
export class FraudDetectionModule {}
