// BehaviorTracker aggregates various fraud detection sub‑trackers.
// It provides a simple API used by the survey taker UI to record user actions.

import { ResponseTimeTracker } from '@/lib/fraud/responseTimeTracker';
import { ClickPatternAnalyzer } from '@/lib/fraud/clickPatternAnalyzer';
import { InteractionDepthTracker } from '@/lib/fraud/interactionDepth';

/**
 * Signals collected from all sub‑trackers.
 */
export interface BehavioralSignals {
  responseTimes: ReturnType<ResponseTimeTracker['getSignals']>;
  clickPattern: ReturnType<ClickPatternAnalyzer['getSignals']>;
  interactionDepth: ReturnType<InteractionDepthTracker['getSignals']>;
}

export class BehaviorTracker {
  private responseTracker: ResponseTimeTracker;
  private clickAnalyzer: ClickPatternAnalyzer;
  private interactionTracker: InteractionDepthTracker;

  constructor() {
    this.responseTracker = new ResponseTimeTracker();
    this.clickAnalyzer = new ClickPatternAnalyzer();
    this.interactionTracker = new InteractionDepthTracker();
  }

  /** Start a new survey session – resets all sub‑trackers. */
  start(): void {
    this.responseTracker.reset();
    this.clickAnalyzer.reset();
    this.interactionTracker.reset();
  }

  /** Record that a question with the given id is now shown. */
  recordQuestion(id: string): void {
    this.responseTracker.startQuestion(id);
  }

  /** Record the user's answer to a question. */
  recordAnswer(id: string, _answer: unknown): void {
    // The answer itself is not needed for fraud signals, but we keep the method for API compatibility.
    this.responseTracker.recordResponse(id);
  }

  /** End the survey – can be used to perform any final calculations. */
  end(): void {
    // No-op currently – sub‑trackers compute signals on demand.
  }

  /** Return aggregated signals for the whole session. */
  getSignals(): BehavioralSignals {
    return {
      responseTimes: this.responseTracker.getSignals(),
      clickPattern: this.clickAnalyzer.getSignals(),
      interactionDepth: this.interactionTracker.getSignals(),
    };
  }
}
