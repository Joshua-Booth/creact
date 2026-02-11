import { describe, expect, it } from "vitest";

import { getSiteUrl, SITE_NAME, TWITTER_HANDLE } from "./seo";

describe("seo config", () => {
  it("should return site URL from environment", () => {
    const url = getSiteUrl();

    expect(typeof url).toBe("string");
    expect(url.length).toBeGreaterThan(0);
  });

  it("should export site name", () => {
    expect(SITE_NAME).toBe("creact");
  });

  it("should export twitter handle", () => {
    expect(TWITTER_HANDLE).toBe("@joshuaboothnz");
  });
});
