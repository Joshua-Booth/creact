import { redirect } from "react-router";

/**
 * Sets auth token in localStorage for Zustand rehydration and redirects to dashboard.
 * Used by login/signup actions that can't use React hooks.
 * @param token - The authentication token to store
 * @returns A redirect response to the dashboard
 */
export function setAuthTokenAndRedirect(token: string): Response {
  localStorage.setItem("token", token);
  localStorage.setItem(
    "auth-storage",
    JSON.stringify({ state: { token, authenticated: true } })
  );
  return redirect("/dashboard");
}
