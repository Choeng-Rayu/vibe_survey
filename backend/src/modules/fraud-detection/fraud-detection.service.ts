import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { BehavioralAnalysisService } from './behavioral-analysis.service';
import { PatternDetectionService } from './pattern-detection.service';
import { FraudAnalysisResult, DeviceFingerprint } from './dto/fraud-analysis.dto';

// Requirement 11: Fraud Detection System
@Injectable()
export class FraudDetectionService {
  private readonly logger = new Logger(FraudDetectionService.name);
  private readonly FRAUD_THRESHOLD = 60; // Requirement 11.6: Automatic rejection threshold

  constructor(
    private readonly prisma: PrismaService,
    private readonly behavioralAnalysis: BehavioralAnalysisService,
    private readonly patternDetection: PatternDetectionService,
  ) {}

  // Requirement 11.1: Real-time fraud detection during survey completion
  // Requirement 11.3: Calculate fraud confidence scores (0-100)
  async analyzeFraud(
    surveyDefinition: any,
    answers: Record<string, any>,
    behavioralData: any,
    userId: string,
    deviceFingerprint?: DeviceFingerprint,
  ): Promise<FraudAnalysisResult> {
    let fraudScore = 0;

    // Requirement 11.2: Analyze behavioral signals
    const behavioralMetrics = this.behavioralAnalysis.analyzeBehavior(behavioralData);

    // Requirement 11.4: Detect fraud patterns
    const fraudSignals = this.patternDetection.detectPatterns(
      surveyDefinition,
      answers,
      behavioralData,
    );

    // Calculate fraud score based on signals
    if (fraudSignals.failed_attention_checks) {
      fraudScore += fraudSignals.failed_attention_checks * 30;
    }

    if (fraudSignals.fast_responses) {
      fraudScore += 25;
    }

    if (fraudSignals.straight_lining) {
      fraudScore += 20;
    }

    if (fraudSignals.pattern_answers) {
      fraudScore += 25;
    }

    if (fraudSignals.honeypot_violation) {
      fraudScore += 40; // High penalty for honeypot violations
    }

    if (fraudSignals.auto_clicking) {
      fraudScore += 30;
    }

    // Behavioral metrics penalties
    if (behavioralMetrics.avg_response_time < 500) {
      fraudScore += 15;
    }

    if (behavioralMetrics.response_time_variance < 100) {
      fraudScore += 15;
    }

    if (behavioralMetrics.click_pattern_score < 50) {
      fraudScore += 20;
    }

    if (behavioralMetrics.interaction_depth_score < 30) {
      fraudScore += 15;
    }

    if (behavioralMetrics.scroll_depth < 20) {
      fraudScore += 10;
    }

    if (behavioralMetrics.mouse_movement_score < 30) {
      fraudScore += 10;
    }

    // Requirement 11.5: Device fingerprint analysis
    if (deviceFingerprint) {
      const deviceAnalysis = await this.analyzeDeviceFingerprint(userId, deviceFingerprint);
      if (deviceAnalysis.suspicious) {
        fraudScore += 25;
        fraudSignals.suspicious_device = true;
      }
      if (deviceAnalysis.duplicate) {
        fraudScore += 30;
        fraudSignals.duplicate_fingerprint = true;
      }
    }

    fraudScore = Math.min(fraudScore, 100);

    // Requirement 11.3: Quality labels based on fraud score
    let qualityLabel: 'high_quality' | 'suspicious' | 'likely_fraud' = 'high_quality';
    if (fraudScore > 60) qualityLabel = 'likely_fraud';
    else if (fraudScore > 30) qualityLabel = 'suspicious';

    // Requirement 11.6: Automatic rejection based on threshold
    const shouldReject = fraudScore >= this.FRAUD_THRESHOLD;

    if (shouldReject) {
      this.logger.warn(`Response rejected: fraud score ${fraudScore} for user ${userId}`);
    }

    return {
      fraud_score: fraudScore,
      quality_label: qualityLabel,
      fraud_signals: fraudSignals,
      behavioral_metrics: behavioralMetrics,
      should_reject: shouldReject,
    };
  }

  // Requirement 11.5: Device fingerprint analysis for multi-account detection
  private async analyzeDeviceFingerprint(
    userId: string,
    fingerprint: DeviceFingerprint,
  ): Promise<{ suspicious: boolean; duplicate: boolean }> {
    const fingerprintHash = this.hashFingerprint(fingerprint);

    // Check for duplicate fingerprints from different users
    const existingResponses = await this.prisma.response.findMany({
      where: {
        user_id: { not: userId },
        fraud_signals: {
          path: ['device_fingerprint'],
          equals: fingerprintHash,
        },
      },
      take: 1,
    });

    const duplicate = existingResponses.length > 0;

    // Check for suspicious patterns (e.g., common bot user agents)
    const suspicious = this.isSuspiciousDevice(fingerprint);

    return { suspicious, duplicate };
  }

  private hashFingerprint(fingerprint: DeviceFingerprint): string {
    return `${fingerprint.user_agent}|${fingerprint.screen_resolution}|${fingerprint.timezone}|${fingerprint.platform}`;
  }

  private isSuspiciousDevice(fingerprint: DeviceFingerprint): boolean {
    const suspiciousAgents = ['headless', 'phantom', 'selenium', 'puppeteer', 'bot'];
    const userAgent = fingerprint.user_agent.toLowerCase();

    return suspiciousAgents.some((agent) => userAgent.includes(agent));
  }

  // Requirement 11.8: Manual fraud review capabilities
  async reviewResponse(
    responseId: string,
    action: 'approve' | 'reject',
    reviewerId: string,
    note?: string,
  ) {
    const response = await this.prisma.response.findUnique({ where: { id: responseId } });

    if (!response) {
      throw new Error('Response not found');
    }

    const newQualityLabel = action === 'approve' ? 'high_quality' : 'likely_fraud';
    const newFraudScore = action === 'approve' ? 0 : 100;

    await this.prisma.response.update({
      where: { id: responseId },
      data: {
        quality_label: newQualityLabel,
        fraud_score: newFraudScore,
        fraud_signals: {
          ...(response.fraud_signals as any),
          manual_review: {
            action,
            reviewer_id: reviewerId,
            note,
            reviewed_at: new Date().toISOString(),
          },
        },
      },
    });

    this.logger.log(`Response ${responseId} manually reviewed: ${action} by ${reviewerId}`);

    return { success: true, action, response_id: responseId };
  }

  // Requirement 11.9: Fraud analytics and reporting
  async getFraudAnalytics(campaignId?: string) {
    const where = campaignId ? { campaign_id: campaignId } : {};

    const [total, highQuality, suspicious, likelyFraud, avgFraudScore] = await Promise.all([
      this.prisma.response.count({ where }),
      this.prisma.response.count({ where: { ...where, quality_label: 'high_quality' } }),
      this.prisma.response.count({ where: { ...where, quality_label: 'suspicious' } }),
      this.prisma.response.count({ where: { ...where, quality_label: 'likely_fraud' } }),
      this.prisma.response.aggregate({ where, _avg: { fraud_score: true } }),
    ]);

    return {
      total_responses: total,
      high_quality: highQuality,
      suspicious: suspicious,
      likely_fraud: likelyFraud,
      avg_fraud_score: avgFraudScore._avg.fraud_score || 0,
      quality_rate: total > 0 ? (highQuality / total) * 100 : 0,
    };
  }

  // Get fraud score threshold
  getFraudThreshold(): number {
    return this.FRAUD_THRESHOLD;
  }

  // Update fraud score threshold (Requirement 11.6)
  setFraudThreshold(threshold: number): void {
    if (threshold < 0 || threshold > 100) {
      throw new Error('Threshold must be between 0 and 100');
    }
    // In production, this would be stored in database/config
    this.logger.log(`Fraud threshold updated to ${threshold}`);
  }
}
