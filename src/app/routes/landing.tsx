import { LandingPage } from "@/pages/landing";
import {
  generateMeta,
  getLocaleFromMatches,
  getSeoTranslation,
} from "@/shared/lib/seo";

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

export default LandingPage;
