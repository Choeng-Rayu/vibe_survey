import { Injectable } from '@nestjs/common';
import { FraudSignals } from './dto/fraud-analysis.dto';

// Requirement 11.4: Detect common fraud patterns (straight-lining, auto-clicking, honeypot violations)
@Injectable()
export class PatternDetectionService {
  detectPatterns(
    surveyDefinition: any,
    answers: Record<string, any>,
    behavioralData: any,
  ): FraudSignals {
    const signals: FraudSignals = {};

    // Requirement 11.4: Straight-lining detection
    if (this.detectStraightLining(answers)) {
      signals.straight_lining = true;
    }

    // Pattern answers (all same value)
    if (this.detectPatternAnswers(answers)) {
      signals.pattern_answers = true;
    }

    // Requirement 11.4: Honeypot violations
    const honeypotViolation = this.detectHoneypotViolation(surveyDefinition, answers);
    if (honeypotViolation) {
      signals.honeypot_violation = true;
    }

    // Requirement 11.4: Auto-clicking detection
    if (this.detectAutoClicking(behavioralData)) {
      signals.auto_clicking = true;
    }

    // Fast responses
    if (this.detectFastResponses(behavioralData)) {
      signals.fast_responses = true;
    }

    return signals;
  }

  // Detect if user selected same option for all questions
  private detectStraightLining(answers: Record<string, any>): boolean {
    const values = Object.values(answers);
    if (values.length < 3) return false;

    const uniqueValues = new Set(values);
    return uniqueValues.size === 1;
  }

  // Detect repetitive answer patterns
  private detectPatternAnswers(answers: Record<string, any>): boolean {
    const values = Object.values(answers).filter(
      (v) => typeof v === 'number' || typeof v === 'string',
    );
    if (values.length < 5) return false;

    // Check for alternating pattern (1,2,1,2,1,2)
    let alternating = true;
    for (let i = 2; i < values.length; i++) {
      if (values[i] !== values[i - 2]) {
        alternating = false;
        break;
      }
    }

    return alternating;
  }

  // Requirement 11.4: Honeypot question detection
  private detectHoneypotViolation(surveyDefinition: any, answers: Record<string, any>): boolean {
    const honeypots = surveyDefinition?.questions?.filter((q: any) => q.is_honeypot) || [];

    for (const honeypot of honeypots) {
      // Honeypot questions should not be answered (they're hidden)
      if (
        answers[honeypot.id] !== undefined &&
        answers[honeypot.id] !== null &&
        answers[honeypot.id] !== ''
      ) {
        return true;
      }
    }

    return false;
  }

  // Detect auto-clicking based on uniform response times
  private detectAutoClicking(behavioralData: any): boolean {
    const clickEvents = behavioralData?.click_events || [];
    if (clickEvents.length < 5) return false;

    const intervals: number[] = [];
    for (let i = 1; i < clickEvents.length; i++) {
      intervals.push(clickEvents[i].timestamp - clickEvents[i - 1].timestamp);
    }

    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, i) => sum + Math.pow(i - avg, 2), 0) / intervals.length;

    // Very low variance indicates automated clicking
    return variance < 100;
  }

  // Detect suspiciously fast responses
  private detectFastResponses(behavioralData: any): boolean {
    if (!behavioralData?.response_times) return false;

    const times = Object.values(behavioralData.response_times) as number[];
    if (times.length === 0) return false;

    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    return avg < 500; // Less than 500ms average is suspicious
  }
}
