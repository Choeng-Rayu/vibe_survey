// lib/auth/fingerprint.ts
// Generates a simple device fingerprint using various navigator properties and a canvas hash.

/**
 * Returns a base64‑encoded fingerprint string.
 */
export function generateDeviceFingerprint(): string {
  const parts: string[] = [];

  // User agent
  if (typeof navigator !== "undefined") {
    parts.push(navigator.userAgent);
    parts.push(navigator.language);
    parts.push(`${window.screen.width}x${window.screen.height}`);
    parts.push(`tz${new Date().getTimezoneOffset()}`);
  }

  // Canvas fingerprint
  let canvasData = "";
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.textBaseline = "top";
      ctx.font = "14px 'Arial'";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      ctx.fillText("https://example.com", 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillText("https://example.com", 4, 17);
      canvasData = canvas.toDataURL();
    }
  } catch (e) {
    // ignore errors – fallback to empty string
  }
  parts.push(canvasData);

  const raw = parts.join("|");
  return btoa(raw);
}
