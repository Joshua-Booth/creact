import { href, Outlet, redirect } from "react-router";

import { getAuthToken } from "@/entities/user";

export function clientLoader() {
  if (getAuthToken() === null) return redirect(href("/login"));

  return null;
}

export default function ProtectedLayout() {
  return <Outlet />;
}
