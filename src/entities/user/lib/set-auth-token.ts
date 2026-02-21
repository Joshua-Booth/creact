import { href, redirect } from "react-router";

/**
 * Sets auth token in localStorage and redirects to dashboard.
 * Used by login/signup actions that can't use React hooks.
 * @param token - The authentication token to store
 * @returns A redirect response to the dashboard
 */
export function setAuthTokenAndRedirect(token: string): Response {
  localStorage.setItem("token", token);
  return redirect(href("/dashboard"));
}
