import { Injectable } from '@nestjs/common';
import { BehavioralMetrics } from './dto/fraud-analysis.dto';

// Requirement 11.2: Analyze behavioral signals (response time, click patterns, interaction depth)
@Injectable()
export class BehavioralAnalysisService {
  analyzeBehavior(behavioralData: any): BehavioralMetrics {
    const responseTimes = this.extractResponseTimes(behavioralData);
    const clickEvents = behavioralData?.click_events || [];
    const scrollEvents = behavioralData?.scroll_events || [];
    const mouseMovements = behavioralData?.mouse_movements || [];

    return {
      avg_response_time: this.calculateAvgResponseTime(responseTimes),
      response_time_variance: this.calculateVariance(responseTimes),
      click_pattern_score: this.analyzeClickPattern(clickEvents),
      interaction_depth_score: this.calculateInteractionDepth(
        clickEvents,
        scrollEvents,
        mouseMovements,
      ),
      scroll_depth: this.calculateScrollDepth(scrollEvents),
      mouse_movement_score: this.analyzeMouseMovement(mouseMovements),
    };
  }

  private extractResponseTimes(behavioralData: any): number[] {
    if (!behavioralData?.response_times) return [];
    const times = behavioralData.response_times;
    return typeof times === 'object' ? Object.values(times) : [];
  }

  private calculateAvgResponseTime(times: number[]): number {
    if (times.length === 0) return 0;
    return times.reduce((a, b) => a + b, 0) / times.length;
  }

  private calculateVariance(times: number[]): number {
    if (times.length === 0) return 0;
    const avg = this.calculateAvgResponseTime(times);
    return times.reduce((sum, t) => sum + Math.pow(t - avg, 2), 0) / times.length;
  }

  // Requirement 11.4: Detect auto-clicking patterns
  private analyzeClickPattern(clickEvents: any[]): number {
    if (clickEvents.length < 3) return 100;

    // Check for uniform intervals (auto-clicking)
    const intervals: number[] = [];
    for (let i = 1; i < clickEvents.length; i++) {
      const interval = clickEvents[i].timestamp - clickEvents[i - 1].timestamp;
      intervals.push(interval);
    }

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance =
      intervals.reduce((sum, i) => sum + Math.pow(i - avgInterval, 2), 0) / intervals.length;

    // Low variance indicates auto-clicking
    if (variance < 100) return 0; // Suspicious
    if (variance < 500) return 50; // Moderate
    return 100; // Normal
  }

  private calculateInteractionDepth(clicks: any[], scrolls: any[], movements: any[]): number {
    const totalInteractions = clicks.length + scrolls.length + movements.length;

    if (totalInteractions === 0) return 0;
    if (totalInteractions < 5) return 30;
    if (totalInteractions < 10) return 60;
    return 100;
  }

  private calculateScrollDepth(scrollEvents: any[]): number {
    if (scrollEvents.length === 0) return 0;

    const maxDepth = Math.max(...scrollEvents.map((e: any) => e.depth || 0));
    return Math.min(maxDepth, 100);
  }

  private analyzeMouseMovement(movements: any[]): number {
    if (movements.length === 0) return 0;
    if (movements.length < 10) return 30;

    // Check for natural movement patterns
    const distances: number[] = [];
    for (let i = 1; i < movements.length; i++) {
      const dx = movements[i].x - movements[i - 1].x;
      const dy = movements[i].y - movements[i - 1].y;
      distances.push(Math.sqrt(dx * dx + dy * dy));
    }

    const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;

    // Very uniform movement is suspicious
    if (avgDistance < 5) return 20;
    if (avgDistance < 20) return 60;
    return 100;
  }
}
