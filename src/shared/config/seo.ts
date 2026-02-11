/** SEO configuration constants */

/**
 * Site URL from environment, with fallback for development.
 * @returns Site URL string
 */
export function getSiteUrl(): string {
  /* v8 ignore start -- Fallback only used when env var is missing */
  return import.meta.env.VITE_PUBLIC_URL ?? "https://creact.netlify.app";
  /* v8 ignore stop */
}

/** Twitter handle for social cards */
// cspell:disable-next-line
export const TWITTER_HANDLE = "@joshuaboothnz";

/** Default Open Graph image path (relative to site root) */
export const DEFAULT_OG_IMAGE = "/og-image.png";

/** Site name for meta tags */
export const SITE_NAME = "creact";
