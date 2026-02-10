import { beforeEach, describe, expect, it, vi } from "vitest";

import { setAuthTokenAndRedirect } from "./set-auth-token";

const localStorageMock = (() => {
  let store = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
    clear: vi.fn(() => {
      store = new Map();
    }),
    get length() {
      return store.size;
    },
    key: vi.fn((_index: number) => null),
  };
})();

vi.stubGlobal("localStorage", localStorageMock);

vi.mock("react-router", () => ({
  href: vi.fn((path: string) => path),
  redirect: vi.fn(
    (path: string) =>
      new Response(null, {
        status: 302,
        headers: { Location: path },
      })
  ),
}));

describe("setAuthTokenAndRedirect", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it("should set token in localStorage", () => {
    setAuthTokenAndRedirect("my-token");

    expect(localStorageMock.setItem).toHaveBeenCalledWith("token", "my-token");
  });

  it("should set auth-storage JSON in localStorage", () => {
    setAuthTokenAndRedirect("my-token");

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "auth-storage",
      JSON.stringify({ state: { token: "my-token", authenticated: true } })
    );
  });

  it("should return a Response (redirect)", () => {
    const result = setAuthTokenAndRedirect("my-token");

    expect(result).toBeInstanceOf(Response);
  });
});
