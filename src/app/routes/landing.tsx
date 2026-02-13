import { LandingPage } from "@/pages/landing";
import {
  generateMeta,
  getLocaleFromMatches,
  getSeoTranslation,
} from "@/shared/lib/seo";
import { RouteErrorFallback } from "@/shared/ui/error-boundary";

import type { Route } from "./+types/landing";

export function meta({ matches }: Route.MetaArgs) {
  const locale = getLocaleFromMatches(matches);
  const seo = getSeoTranslation(locale, "home");

  return generateMeta({
    title: seo.title,
    description: seo.description,
    canonicalPath: "/",
  });
}

export const ErrorBoundary = RouteErrorFallback;

export default LandingPage;
