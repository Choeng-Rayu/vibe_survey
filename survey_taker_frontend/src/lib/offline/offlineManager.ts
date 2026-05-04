// OfflineManager stores responses while the client is offline and syncs them when back online.
// For simplicity, this implementation uses an in‑memory array instead of IndexedDB.
// Replace the stub with a real idb implementation when needed.

type OfflineResponse = any;

// Placeholder for the network send implementation.
async function sendResponse(response: OfflineResponse): Promise<void> {
  // Simulate a successful send.
  return Promise.resolve();
}

export class OfflineManager {
  private offlineStore: OfflineResponse[] = [];

  /** Store a response locally when the app is offline. */
  public async storeOfflineResponse(response: OfflineResponse): Promise<void> {
    this.offlineStore.push(response);
  }

  /** Attempt to sync all stored responses.
   *  Successfully sent items are removed from the store.
   */
  public async syncWhenOnline(): Promise<void> {
    const pending = [...this.offlineStore]; // Snapshot.
    for (const resp of pending) {
      try {
        await sendResponse(resp);
        // Remove from the store upon success.
        this.offlineStore = this.offlineStore.filter((r) => r !== resp);
      } catch (e) {
        // Keep the response for a later retry.
      }
    }
  }
}
