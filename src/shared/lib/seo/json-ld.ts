import { getSiteUrl, SITE_NAME } from "@/shared/config";

/** Organization schema for structured data */
export interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
}

/** WebSite schema for structured data */
export interface WebSiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
}

/** Generates Organization JSON-LD structured data */
export function generateOrganizationJsonLd(): OrganizationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: getSiteUrl(),
  };
}

/** Generates WebSite JSON-LD structured data */
export function generateWebSiteJsonLd(): WebSiteSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: getSiteUrl(),
  };
}
