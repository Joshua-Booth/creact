import { describe, expect, it, vi } from "vitest";

import type * as ConfigModule from "@/shared/config";
import { resources } from "@/shared/i18n";

const { envState } = vi.hoisted(() => ({
  envState: { NODE_ENV: "test" },
}));

// Proxy `env` so NODE_ENV can be flipped per-test (the parsed env is otherwise frozen at import).
vi.mock("@/shared/config", async (importOriginal) => {
  const actual = await importOriginal<typeof ConfigModule>();
  return {
    ...actual,
    env: new Proxy(actual.env, {
      get: (target, prop) =>
        prop === "NODE_ENV"
          ? envState.NODE_ENV
          : (Reflect.get(target, prop) as unknown),
    }),
  };
});

const { loader } = await import("./locales");

const call = (lng: string, ns: string) =>
  loader({ params: { lng, ns } } as Parameters<typeof loader>[0]);

describe("locales loader", () => {
  it("returns 400 for an unsupported language", () => {
    const result = call("fr", "common");

    expect(result.init?.status).toBe(400);
    expect(result.data).toEqual({ error: "Invalid language" });
  });

  it("returns 400 for an unknown namespace", () => {
    const result = call("en", "missing");

    expect(result.init?.status).toBe(400);
    expect(result.data).toEqual({ error: "Invalid namespace" });
  });

  it("returns the requested namespace resources", () => {
    const result = call("en", "common");

    expect(result.data).toBe(resources.en.common);
  });

  it("omits cache headers outside production", () => {
    envState.NODE_ENV = "test";
    const result = call("en", "common");

    expect(new Headers(result.init?.headers).get("Cache-Control")).toBeNull();
  });

  it("sets a long-lived cache header in production", () => {
    envState.NODE_ENV = "production";
    const result = call("en", "common");
    envState.NODE_ENV = "test";

    expect(new Headers(result.init?.headers).get("Cache-Control")).toContain(
      "max-age=300"
    );
  });
});
