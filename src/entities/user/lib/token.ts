export const TOKEN_KEY = "token";

/**
 * Read the stored auth token from localStorage.
 * @returns The stored token, or null if absent or running on the server.
 */
export function getAuthToken() {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}
