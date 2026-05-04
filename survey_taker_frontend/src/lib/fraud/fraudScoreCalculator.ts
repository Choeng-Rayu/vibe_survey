// FraudScoreCalculator computes a fraud confidence score from behavioral signals.

import { BehavioralSignals } from '@/lib/fraud/behaviorTracker';

export enum QualityLabel {
  HIGH_QUALITY = 'High Quality', // 0–30
  SUSPICIOUS = 'Suspicious', // 31–60
  LIKELY_FRAUD = 'Likely Fraud', // 61–100
}

export interface FlaggedSignal {
  type: string;
  value: number;
  threshold: number;
  weight: number;
  description: string;
}

export interface FraudAnalysis {
  surveyResponseId: string;
  behavioralSignals: BehavioralSignals;
  fraudConfidenceScore: number; // 0-100
  qualityLabel: QualityLabel;
  flaggedSignals: FlaggedSignal[];
  calculatedAt: Date;
}

/** Helper: assign a quality label based on score thresholds. */
export function assignQualityLabel(score: number): QualityLabel {
  if (score <= 30) return QualityLabel.HIGH_QUALITY;
  if (score <= 60) return QualityLabel.SUSPICIOUS;
  return QualityLabel.LIKELY_FRAUD;
}

/** Stub score calculators – each returns a number in the range 0‑100. */
function computeResponseTimeScore(_signals: any): number {
  return 50; // placeholder
}
function computeClickPatternScore(_signals: any): number {
  return 50;
}
function computeAnswerPatternScore(_signals: any): number {
  return 50;
}
function computeInteractionDepthScore(_signals: any): number {
  return 50;
}
function computeAttentionCheckScore(_signals: any): number {
  return 50;
}

export class FraudScoreCalculator {
  private weights: Record<string, number> = {
    responseTime: 0.25,
    clickPattern: 0.20,
    answerPattern: 0.20,
    interactionDepth: 0.20,
    attentionCheck: 0.15,
  };

  /**
   * Calculate a fraud analysis object from collected signals.
   * "honeypotAnswered" is an optional flag that, when true, adds +30 to the score.
   */
  calculateScore(signals: BehavioralSignals & { honeypotAnswered?: boolean }): FraudAnalysis {
    // Compute individual sub‑scores (placeholder implementations).
    const responseTimeScore = computeResponseTimeScore(signals.responseTimes);
    const clickPatternScore = computeClickPatternScore(signals.clickPattern);
    const answerPatternScore = computeAnswerPatternScore(signals as any);
    const interactionDepthScore = computeInteractionDepthScore(signals.interactionDepth);
    const attentionCheckScore = computeAttentionCheckScore(signals as any);

    // Weighted sum.
    const weightedSum =
      responseTimeScore * this.weights.responseTime +
      clickPatternScore * this.weights.clickPattern +
      answerPatternScore * this.weights.answerPattern +
      interactionDepthScore * this.weights.interactionDepth +
      attentionCheckScore * this.weights.attentionCheck;

    // Clamp and round.
    let fraudScore = Math.round(weightedSum);
    fraudScore = Math.max(0, Math.min(100, fraudScore));

    // Add honeypot penalty if applicable.
    if (signals.honeypotAnswered) {
      fraudScore = Math.min(100, fraudScore + 30);
    }

    const analysis: FraudAnalysis = {
      surveyResponseId: '', // to be filled by caller
      behavioralSignals: signals,
      fraudConfidenceScore: fraudScore,
      qualityLabel: assignQualityLabel(fraudScore),
      flaggedSignals: [], // future implementation
      calculatedAt: new Date(),
    };

    return analysis;
  }
}
