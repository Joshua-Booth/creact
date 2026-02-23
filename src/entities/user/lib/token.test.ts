import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getAuthToken,
  removeAuthToken,
  setAuthToken,
  TOKEN_KEY,
} from "./token";

let store: Map<string, string>;

const createLocalStorageMock = () => ({
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => {
    store.set(key, value);
  },
  removeItem: (key: string) => {
    store.delete(key);
  },
  clear: () => {
    store.clear();
  },
  get length() {
    return store.size;
  },
  key: (_index: number) => null,
});

describe("token", () => {
  beforeEach(() => {
    store = new Map();
    vi.stubGlobal("localStorage", createLocalStorageMock());
    vi.stubGlobal("window", globalThis);
  });

  describe("getAuthToken", () => {
    it("should return null when no token is stored", () => {
      expect(getAuthToken()).toBeNull();
    });

    it("should return the stored token", () => {
      store.set(TOKEN_KEY, "my-token");

      expect(getAuthToken()).toBe("my-token");
    });

    it("should return null when window is undefined (SSR)", () => {
      vi.unstubAllGlobals();

      expect(getAuthToken()).toBeNull();
    });
  });

  describe("setAuthToken", () => {
    it("should persist the token to localStorage", () => {
      setAuthToken("new-token");

      expect(store.get(TOKEN_KEY)).toBe("new-token");
    });

    it("should overwrite an existing token", () => {
      store.set(TOKEN_KEY, "old-token");

      setAuthToken("updated-token");

      expect(store.get(TOKEN_KEY)).toBe("updated-token");
    });
  });

  describe("removeAuthToken", () => {
    it("should remove the token from localStorage", () => {
      store.set(TOKEN_KEY, "token-to-remove");

      removeAuthToken();

      expect(store.has(TOKEN_KEY)).toBe(false);
    });

    it("should be a no-op when no token exists", () => {
      expect(() => removeAuthToken()).not.toThrow();
      expect(store.has(TOKEN_KEY)).toBe(false);
    });
  });
});
