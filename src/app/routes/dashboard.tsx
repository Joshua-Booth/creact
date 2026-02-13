import { DashboardPage } from "@/pages/dashboard";
import {
  generateMeta,
  getLocaleFromMatches,
  getSeoTranslation,
} from "@/shared/lib/seo";
import { RouteErrorFallback } from "@/shared/ui/error-boundary";

import type { Route } from "./+types/dashboard";

export function meta({ matches }: Route.MetaArgs) {
  const locale = getLocaleFromMatches(matches);
  const seo = getSeoTranslation(locale, "dashboard");

  return generateMeta({
    title: seo.title,
    description: seo.description,
    noIndex: true,
  });
}

export const ErrorBoundary = RouteErrorFallback;

export default DashboardPage;
