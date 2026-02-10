import { afterEach, describe, expect, it, vi } from "vitest";

import { generateMeta, getLocaleFromMatches, getSeoTranslation } from "./meta";

describe("getLocaleFromMatches", () => {
  it("should return locale from root match with valid locale", () => {
    const matches = [{ id: "root", loaderData: { locale: "en" } }];
    expect(getLocaleFromMatches(matches)).toBe("en");
  });

  it("should fall back to default language for invalid locale", () => {
    const matches = [{ id: "root", loaderData: { locale: "zz" } }];
    expect(getLocaleFromMatches(matches)).toBe("en");
  });

  it("should fall back to default language when no root match exists", () => {
    const matches = [{ id: "other", loaderData: { locale: "en" } }];
    expect(getLocaleFromMatches(matches)).toBe("en");
  });

  it("should fall back to default language for empty array", () => {
    expect(getLocaleFromMatches([])).toBe("en");
  });

  it("should fall back when loaderData is null", () => {
    const matches = [{ id: "root", loaderData: null }];
    expect(getLocaleFromMatches(matches)).toBe("en");
  });

  it("should fall back when loaderData has no locale property", () => {
    const matches = [{ id: "root", loaderData: { other: "value" } }];
    expect(getLocaleFromMatches(matches)).toBe("en");
  });
});

describe("getSeoTranslation", () => {
  it("should return correct title and description for home page", () => {
    const result = getSeoTranslation("en", "home");
    expect(result).toEqual({
      title: "Home",
      description: "Welcome to creact - A modern React frontend template.",
    });
  });

  it("should return correct title and description for login page", () => {
    const result = getSeoTranslation("en", "login");
    expect(result).toEqual({
      title: "Login",
      description: "Sign in to your account.",
    });
  });
});

describe("generateMeta", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("should generate base meta descriptors", () => {
    vi.stubEnv("VITE_PUBLIC_URL", "https://example.com");

    const meta = generateMeta({
      title: "Test Page",
      description: "Test description",
    });

    expect(meta).toContainEqual({ title: "Test Page | creact" });
    expect(meta).toContainEqual({
      name: "description",
      content: "Test description",
    });
    expect(meta).toContainEqual({
      property: "og:title",
      content: "Test Page | creact",
    });
    expect(meta).toContainEqual({
      property: "og:type",
      content: "website",
    });
    expect(meta).toContainEqual({
      property: "og:image",
      content: "https://example.com/og-image.png",
    });
  });

  it("should include canonical link when canonicalPath is provided", () => {
    vi.stubEnv("VITE_PUBLIC_URL", "https://example.com");

    const meta = generateMeta({
      title: "Test",
      description: "Test",
      canonicalPath: "/about",
    });

    expect(meta).toContainEqual({
      tagName: "link",
      rel: "canonical",
      href: "https://example.com/about",
    });
  });

  it("should use custom ogImage when provided", () => {
    vi.stubEnv("VITE_PUBLIC_URL", "https://example.com");

    const meta = generateMeta({
      title: "Test",
      description: "Test",
      ogImage: "/custom-image.png",
    });

    expect(meta).toContainEqual({
      property: "og:image",
      content: "https://example.com/custom-image.png",
    });
  });

  it("should add noindex meta when noIndex is true", () => {
    vi.stubEnv("VITE_PUBLIC_URL", "https://example.com");

    const meta = generateMeta({
      title: "Test",
      description: "Test",
      noIndex: true,
    });

    expect(meta).toContainEqual({
      name: "robots",
      content: "noindex, nofollow",
    });
  });

  it("should not include noindex meta by default", () => {
    vi.stubEnv("VITE_PUBLIC_URL", "https://example.com");

    const meta = generateMeta({
      title: "Test",
      description: "Test",
    });

    expect(meta).not.toContainEqual(
      expect.objectContaining({ name: "robots" })
    );
  });

  it("should use custom type when provided", () => {
    vi.stubEnv("VITE_PUBLIC_URL", "https://example.com");

    const meta = generateMeta({
      title: "Test",
      description: "Test",
      type: "article",
    });

    expect(meta).toContainEqual({
      property: "og:type",
      content: "article",
    });
  });
});
