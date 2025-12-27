import { describe, it, expect, beforeEach, vi } from "vitest";
import { auth, apiRootUrl, publicUrl } from "./action";

describe("Action utilities", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("auth", () => {
    it("should return authorization header when token exists in localStorage", () => {
      localStorage.setItem("token", "test-token-123");
      const result = auth();
      expect(result).toEqual({ Authorization: "Token test-token-123" });
    });

    it("should return empty object when no token in localStorage", () => {
      const result = auth();
      expect(result).toEqual({});
    });

    it("should return empty object when token is null", () => {
      localStorage.setItem("token", "");
      localStorage.removeItem("token");
      const result = auth();
      expect(result).toEqual({});
    });

    it("should handle different token values", () => {
      const tokens = ["abc123", "bearer-token", "long-token-string-12345"];
      tokens.forEach((token) => {
        localStorage.setItem("token", token);
        const result = auth();
        expect(result).toEqual({ Authorization: `Token ${token}` });
        localStorage.clear();
      });
    });
  });

  describe("apiRootUrl", () => {
    it("should return the VITE_API_ROOT_URL from env", () => {
      const result = apiRootUrl();
      expect(result).toBe(import.meta.env.VITE_API_ROOT_URL);
    });
  });

  describe("publicUrl", () => {
    it("should return the VITE_PUBLIC_URL from env", () => {
      const result = publicUrl();
      expect(result).toBe(import.meta.env.VITE_PUBLIC_URL);
    });
  });
});
