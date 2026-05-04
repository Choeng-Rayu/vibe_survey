// AutoSaveManager handles periodic auto‑saving of survey responses.
// It batches responses in a queue and processes them at a fixed interval.
// Network interactions are represented by placeholder functions.

type ResponseMap = Map<string, any>;

// Placeholder for the actual network save implementation.
async function saveResponses(payload: Record<string, any>): Promise<void> {
  // Simulate network latency; replace with real API call.
  return Promise.resolve();
}

export class AutoSaveManager {
  private saveQueue: ResponseMap = new Map();
  private saveInterval: NodeJS.Timeout | null = null;
  private readonly intervalMs: number = 5000; // Save every 5 seconds.

  /** Start the periodic auto‑save loop. */
  public startAutoSave(): void {
    if (this.saveInterval) return; // Already running.
    this.saveInterval = setInterval(() => this.processSaveQueue(), this.intervalMs);
  }

  /** Queue a response for a given question.
   *  Subsequent calls with the same questionId will overwrite the pending value.
   */
  public queueResponse(questionId: string, response: any): void {
    this.saveQueue.set(questionId, response);
  }

  /** Stop the interval – useful on component unmount. */
  public stopAutoSave(): void {
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
      this.saveInterval = null;
    }
  }

  /** Process the queued responses.
   *  Sends all pending items to the server. On failure the items remain in the queue.
   */
  private async processSaveQueue(): Promise<void> {
    if (this.saveQueue.size === 0) return;
    const payload: Record<string, any> = {};
    this.saveQueue.forEach((value, key) => {
      payload[key] = value;
    });
    try {
      await saveResponses(payload);
      // On success clear the queue.
      this.saveQueue.clear();
    } catch (e) {
      // Preserve existing items for a later retry.
      // Optionally could implement exponential back‑off.
    }
  }
}
