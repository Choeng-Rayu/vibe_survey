// Analyzes click timing patterns to detect automated behaviour.

export interface ClickPatternSignal {
  uniformPattern: boolean;
  rapidClicks: boolean;
  clickCount: number;
  stdDevMs?: number;
}

export class ClickPatternAnalyzer {
  private timestamps: number[]; // ms since epoch

  constructor() {
    this.timestamps = [];
  }

  /** Reset signal collection for a new session. */
  reset(): void {
    this.timestamps = [];
  }

  /** Record a click event – `time` defaults to now. */
  recordClick(time?: number): void {
    this.timestamps.push(time ?? Date.now());
  }

  /** Compute intervals between successive clicks. */
  private getIntervals(): number[] {
    const intervals: number[] = [];
    for (let i = 1; i < this.timestamps.length; i++) {
      intervals.push(this.timestamps[i] - this.timestamps[i - 1]);
    }
    return intervals;
  }

  /** Calculate standard deviation of a numeric array. */
  private stdDev(values: number[]): number {
    if (values.length === 0) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
    return Math.sqrt(variance);
  }

  /** Return the analysis result for the current session. */
  getSignals(): ClickPatternSignal {
    const intervals = this.getIntervals();
    const clickCount = this.timestamps.length;
    const stdDevMs = intervals.length > 0 ? this.stdDev(intervals) : undefined;
    const uniformPattern = intervals.length >= 5 && (stdDevMs ?? 0) < 50;
    const rapidClicks = intervals.some((i) => i < 200);
    return {
      uniformPattern,
      rapidClicks,
      clickCount,
      stdDevMs,
    };
  }
}
