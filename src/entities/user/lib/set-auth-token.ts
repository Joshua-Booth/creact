import { href, redirect } from "react-router";

import { useAuthStore } from "../model/store";

/**
 * Sets auth token in localStorage, syncs the Zustand auth store, and redirects to dashboard.
 * Used by login/signup actions that can't use React hooks.
 * @param token - The authentication token to store
 * @returns A redirect response to the dashboard
 */
export function setAuthTokenAndRedirect(token: string): Response {
  useAuthStore.getState().login(token);
  return redirect(href("/dashboard"));
}
