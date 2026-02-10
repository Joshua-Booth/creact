import { afterEach, describe, expect, it, vi } from "vitest";

import { generateOrganizationJsonLd, generateWebSiteJsonLd } from "./json-ld";

describe("generateOrganizationJsonLd", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("should return correct Organization schema", () => {
    vi.stubEnv("VITE_PUBLIC_URL", "https://example.com");

    const result = generateOrganizationJsonLd();

    expect(result).toEqual({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "creact",
      url: "https://example.com",
    });
  });
});

describe("generateWebSiteJsonLd", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("should return correct WebSite schema", () => {
    vi.stubEnv("VITE_PUBLIC_URL", "https://example.com");

    const result = generateWebSiteJsonLd();

    expect(result).toEqual({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "creact",
      url: "https://example.com",
    });
  });
});
