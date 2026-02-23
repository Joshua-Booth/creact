export const TOKEN_KEY = "token";

/**
 * Read the stored auth token from localStorage.
 * @returns The stored token, or null if absent or running on the server.
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Persist an auth token to localStorage.
 * @param token - The authentication token to store.
 */
export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/** Remove the auth token from localStorage. */
export function removeAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}
