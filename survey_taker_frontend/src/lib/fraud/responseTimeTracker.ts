// Tracks the time a user spends answering each question.

export interface ResponseTimeSignal {
  questionId: string;
  responseTimeMs: number;
  isBelowHumanThreshold: boolean;
}

export class ResponseTimeTracker {
  private startTimes: Map<string, number>; // questionId -> start timestamp
  private signals: ResponseTimeSignal[];

  constructor() {
    this.startTimes = new Map();
    this.signals = [];
  }

  /** Reset the internal state – called when a new session starts. */
  reset(): void {
    this.startTimes.clear();
    this.signals = [];
  }

  /** Mark the moment a question becomes visible. */
  startQuestion(id: string): void {
    this.startTimes.set(id, Date.now());
  }

  /** Record the moment the user submits an answer for the question.
   * Returns the elapsed time in milliseconds.
   */
  recordResponse(id: string): number {
    const start = this.startTimes.get(id);
    const now = Date.now();
    const duration = start !== undefined ? now - start : 0;
    const belowThreshold = duration < 500; // < 500 ms is suspiciously fast
    const signal: ResponseTimeSignal = {
      questionId: id,
      responseTimeMs: duration,
      isBelowHumanThreshold: belowThreshold,
    };
    this.signals.push(signal);
    // Clean up start time to avoid memory leak
    this.startTimes.delete(id);
    return duration;
  }

  /** Return all collected response‑time signals. */
  getSignals(): ResponseTimeSignal[] {
    return this.signals;
  }
}
