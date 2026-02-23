import { href, Outlet, redirect } from "react-router";

import { getAuthToken } from "@/entities/user";

/**
 * Layout route that guards all child routes behind authentication.
 * Redirects to /login when no auth token is present.
 * @returns Null if authenticated, or a redirect response to /login.
 */
export function clientLoader() {
  if (getAuthToken() === null) return redirect(href("/login"));
  return null;
}

export default function ProtectedLayout() {
  return <Outlet />;
}
