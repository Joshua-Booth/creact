import type { Language } from "@/shared/i18n";
import {
  DEFAULT_OG_IMAGE,
  getSiteUrl,
  SITE_NAME,
  TWITTER_HANDLE,
} from "@/shared/config/seo";
import {
  DEFAULT_LANGUAGE,
  resources,
  SUPPORTED_LANGUAGES,
} from "@/shared/i18n";

import type { MetaDescriptor, PageMeta } from "./types";

type SeoPageKey = keyof (typeof resources)["en"]["common"]["seo"]["pages"];

/** Match object from React Router MetaArgs */
interface MetaMatch {
  id: string;
  loaderData?: unknown;
}

/**
 * Type guard to check if a value is a valid Language.
 */
function isLanguage(value: unknown): value is Language {
  return (
    typeof value === "string" && SUPPORTED_LANGUAGES.includes(value as Language)
  );
}

/**
 * Extracts locale from route matches in a type-safe way.
 * Looks for the root match and extracts its locale.
 */
export function getLocaleFromMatches(
  matches: readonly (MetaMatch | undefined)[]
): Language {
  const rootMatch = matches.find(
    (m): m is MetaMatch => m !== undefined && m.id === "root"
  );
  const loaderData = rootMatch?.loaderData;

  if (
    loaderData &&
    typeof loaderData === "object" &&
    "locale" in loaderData &&
    isLanguage(loaderData.locale)
  ) {
    return loaderData.locale;
  }

  return DEFAULT_LANGUAGE;
}

/**
 * Gets SEO translations directly from resources.
 * This avoids issues with i18next instance not being initialized in meta functions.
 */
export function getSeoTranslation(
  locale: Language,
  pageKey: SeoPageKey
): { title: string; description: string } {
  const seo = resources[locale]?.common?.seo ?? resources.en.common.seo;
  const page = seo.pages[pageKey];
  return {
    title: page.title,
    description: page.description,
  };
}

/**
 * Generates an array of meta descriptors for React Router v7.
 * Accepts pre-translated strings for title and description.
 */
export function generateMeta(pageMeta: PageMeta): MetaDescriptor[] {
  const siteUrl = getSiteUrl();
  const fullTitle = `${pageMeta.title} | ${SITE_NAME}`;
  const ogImageUrl = pageMeta.ogImage
    ? `${siteUrl}${pageMeta.ogImage}`
    : `${siteUrl}${DEFAULT_OG_IMAGE}`;
  const canonicalUrl = pageMeta.canonicalPath
    ? `${siteUrl}${pageMeta.canonicalPath}`
    : undefined;

  const meta: MetaDescriptor[] = [
    { title: fullTitle },
    { name: "description", content: pageMeta.description },

    // Open Graph
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: pageMeta.description },
    { property: "og:type", content: pageMeta.type ?? "website" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:image", content: ogImageUrl },

    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: TWITTER_HANDLE },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: pageMeta.description },
    { name: "twitter:image", content: ogImageUrl },
  ];

  // Add canonical URL if specified
  if (canonicalUrl) {
    meta.push({
      tagName: "link",
      rel: "canonical",
      href: canonicalUrl,
    });
  }

  // Add noindex if requested
  if (pageMeta.noIndex) {
    meta.push({ name: "robots", content: "noindex, nofollow" });
  }

  return meta;
}
