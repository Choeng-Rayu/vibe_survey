// lib/auth/tokenManager.ts
// Utility for handling JWT stored in an httpOnly cookie (simulated via document.cookie).

/**
 * Parses document.cookie and returns the value of the given cookie name.
 */
function getCookie(name: string): string | undefined {
  if (typeof document === "undefined" || !document.cookie) return undefined;
  const match = document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith(name + "="));
  if (!match) return undefined;
  return decodeURIComponent(match.substring(name.length + 1));
}

/** Returns the auth JWT token if present. */
export function getAuthToken(): string | undefined {
  // The cookie name is assumed to be "authToken"
  return getCookie("authToken");
}

/** Clears the auth token cookie by setting an expiry date in the past. */
export function clearToken(): void {
  if (typeof document === "undefined") return;
  // Set cookie with past expiration; path=/ to match typical settings.
  document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
}
