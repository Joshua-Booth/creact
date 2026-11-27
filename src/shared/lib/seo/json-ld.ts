import { getSiteUrl, SITE_NAME } from "@/shared/config";

/** Organization schema for structured data */
interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
}

/** WebSite schema for structured data */
interface WebSiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
}

/**
 * Generates Organization JSON-LD structured data.
 * @returns Organization schema object
 */
export function generateOrganizationJsonLd() {
  const schema: OrganizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: getSiteUrl(),
  };

  return schema;
}

/**
 * Generates WebSite JSON-LD structured data.
 * @returns WebSite schema object
 */
export function generateWebSiteJsonLd() {
  const schema: WebSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: getSiteUrl(),
  };

  return schema;
}
