import { href, redirect } from "react-router";

import { logoutAction, LogoutPage } from "@/pages/logout";
import { getAuthToken } from "@/entities/user";
import {
  generateMeta,
  getLocaleFromMatches,
  getSeoTranslation,
} from "@/shared/lib/seo";
import { RouteErrorFallback } from "@/shared/ui/error-boundary";

import type { Route } from "./+types/logout";

export function meta({ matches }: Route.MetaArgs) {
  const locale = getLocaleFromMatches(matches);
  const seo = getSeoTranslation(locale, "logout");

  return generateMeta({
    title: seo.title,
    description: seo.description,
    noIndex: true,
  });
}

export function clientLoader() {
  if (getAuthToken() === null) return redirect(href("/login"));
  return logoutAction();
}

export const ErrorBoundary = RouteErrorFallback;

export default LogoutPage;
