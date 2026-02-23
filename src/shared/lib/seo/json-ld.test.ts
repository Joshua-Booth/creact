import { describe, expect, it, vi } from "vitest";

import { generateOrganizationJsonLd, generateWebSiteJsonLd } from "./json-ld";

vi.mock("@/shared/config/env", () => ({
  env: { VITE_PUBLIC_URL: "https://example.com" },
}));

describe("generateOrganizationJsonLd", () => {
  it("should return correct Organization schema", () => {
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
  it("should return correct WebSite schema", () => {
    const result = generateWebSiteJsonLd();

    expect(result).toEqual({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "creact",
      url: "https://example.com",
    });
  });
});
