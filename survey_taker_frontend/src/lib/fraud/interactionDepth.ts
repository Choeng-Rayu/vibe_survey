// Tracks depth of user interaction – mouse movement, scrolling and focus events.

export interface InteractionDepthSignal {
  totalMouseDistance: number; // pixel distance
  uniqueMousePositions: number;
  totalScrollDistance: number; // pixel distance
  focusLossCount: number;
  totalFocusLossDurationMs: number;
}

export class InteractionDepthTracker {
  private mouseMoves: { x: number; y: number; time: number }[] = [];
  private scrolls: { position: number; time: number }[] = [];
  private focusLosses: { lostAt: number; gainedAt?: number }[] = [];

  /** Reset all stored events. */
  reset(): void {
    this.mouseMoves = [];
    this.scrolls = [];
    this.focusLosses = [];
  }

  /** Record a mousemove event. */
  recordMouseMove(x: number, y: number, time?: number): void {
    this.mouseMoves.push({ x, y, time: time ?? Date.now() });
  }

  /** Record a scroll event – `position` is the vertical scroll offset. */
  recordScroll(position: number, time?: number): void {
    this.scrolls.push({ position, time: time ?? Date.now() });
  }

  /** Record that the window lost focus. */
  recordFocusLoss(time?: number): void {
    this.focusLosses.push({ lostAt: time ?? Date.now() });
  }

  /** Record that the window regained focus – matches the most recent loss. */
  recordFocusGain(time?: number): void {
    const last = this.focusLosses[this.focusLosses.length - 1];
    if (last && last.gainedAt === undefined) {
      last.gainedAt = time ?? Date.now();
    }
  }

  /** Compute total Euclidean distance of mouse movement. */
  private computeMouseDistance(): number {
    let distance = 0;
    for (let i = 1; i < this.mouseMoves.length; i++) {
      const dx = this.mouseMoves[i].x - this.mouseMoves[i - 1].x;
      const dy = this.mouseMoves[i].y - this.mouseMoves[i - 1].y;
      distance += Math.hypot(dx, dy);
    }
    return distance;
  }

  /** Count unique mouse positions (rounded to integer pixels). */
  private countUniqueMousePositions(): number {
    const set = new Set<string>();
    for (const move of this.mouseMoves) {
      set.add(`${Math.round(move.x)}:${Math.round(move.y)}`);
    }
    return set.size;
  }

  /** Compute total scroll distance (sum of absolute differences). */
  private computeScrollDistance(): number {
    let distance = 0;
    for (let i = 1; i < this.scrolls.length; i++) {
      distance += Math.abs(this.scrolls[i].position - this.scrolls[i - 1].position);
    }
    return distance;
  }

  /** Compute total focus loss duration. */
  private computeFocusLossDuration(): number {
    let total = 0;
    for (const loss of this.focusLosses) {
      if (loss.gainedAt !== undefined) {
        total += loss.gainedAt - loss.lostAt;
      }
    }
    return total;
  }

  /** Return aggregated interaction depth signals. */
  getSignals(): InteractionDepthSignal {
    return {
      totalMouseDistance: this.computeMouseDistance(),
      uniqueMousePositions: this.countUniqueMousePositions(),
      totalScrollDistance: this.computeScrollDistance(),
      focusLossCount: this.focusLosses.length,
      totalFocusLossDurationMs: this.computeFocusLossDuration(),
    };
  }
}
