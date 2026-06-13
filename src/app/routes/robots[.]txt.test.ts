import { describe, expect, it } from "vitest";

import { getSiteUrl } from "@/shared/config";

import { loader } from "./robots[.]txt";

describe("robots.txt loader", () => {
  it("serves plain text with cache headers", () => {
    const response = loader();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/plain");
    expect(response.headers.get("Cache-Control")).toBe("public, max-age=86400");
  });

  it("allows crawling, disallows private paths, and links the sitemap", async () => {
    const text = await loader().text();
    const siteUrl = getSiteUrl();

    expect(text).toContain("User-agent: *");
    expect(text).toContain("Allow: /");
    for (const path of [
      "/login",
      "/signup",
      "/logout",
      "/dashboard",
      "/api/",
    ]) {
      expect(text).toContain(`Disallow: ${path}`);
    }
    expect(text).toContain(`Sitemap: ${siteUrl}/sitemap.xml`);
  });
});
