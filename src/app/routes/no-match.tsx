import { NoMatchPage } from "@/pages/no-match";
import {
  generateMeta,
  getLocaleFromMatches,
  getSeoTranslation,
} from "@/shared/lib/seo";

import type { Route } from "./+types/no-match";

export function meta({ matches }: Route.MetaArgs) {
  const locale = getLocaleFromMatches(matches);
  const seo = getSeoTranslation(locale, "notFound");

  return generateMeta({
    title: seo.title,
    description: seo.description,
    noIndex: true,
  });
}

export default NoMatchPage;
