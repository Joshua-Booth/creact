import { describe, expect, it } from "vitest";

import { getSiteUrl } from "@/shared/config";

import { loader } from "./sitemap[.]xml";

describe("sitemap.xml loader", () => {
  it("serves XML with the correct content type and cache headers", () => {
    const response = loader();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/xml");
    expect(response.headers.get("Cache-Control")).toBe("public, max-age=86400");
  });

  it("emits a urlset entry for the site root with weekly priority 1.0", async () => {
    const xml = await loader().text();
    const siteUrl = getSiteUrl();

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    );
    expect(xml).toContain(`<loc>${siteUrl}</loc>`);
    expect(xml).toContain("<changefreq>weekly</changefreq>");
    expect(xml).toContain("<priority>1.0</priority>");
    expect(xml).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
  });
});
