import { beforeEach, describe, expect, it, vi } from "vitest";

describe("token-provider", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("should return null when provider is not configured", async () => {
    const { getToken } = await import("./token-provider");

    expect(getToken()).toBeNull();
  });

  it("should warn in dev mode when provider is not configured", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());
    const { getToken } = await import("./token-provider");

    getToken();

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Token provider not configured")
    );
  });

  it("should return token from configured provider", async () => {
    const { configureTokenProvider, getToken } =
      await import("./token-provider");

    configureTokenProvider(() => "configured-token");

    expect(getToken()).toBe("configured-token");
  });

  it("should return null when configured provider returns null", async () => {
    const { configureTokenProvider, getToken } =
      await import("./token-provider");

    configureTokenProvider(() => null);

    expect(getToken()).toBeNull();
  });

  it("should not warn after provider is configured", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());
    const { configureTokenProvider, getToken } =
      await import("./token-provider");

    configureTokenProvider(() => "token");
    getToken();

    expect(warnSpy).not.toHaveBeenCalled();
  });
});
