import type { NormalizedOptions } from "ky";
import i18next from "i18next";
import { HTTPError } from "ky";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { resources } from "@/shared/i18n";

import { loginApi, parseLoginError } from "./login";

vi.mock("@/shared/api", () => {
  const jsonMock = vi.fn();
  const postMock = vi.fn(() => ({ json: jsonMock }));
  return { api: { post: postMock }, jsonMockFn: jsonMock };
});

function createHTTPError(body: unknown): HTTPError {
  const response = {
    json: () => Promise.resolve(body),
  } as Response;
  return new HTTPError(
    response,
    new Request("https://api.test/login"),
    {} as NormalizedOptions
  );
}

function createHTTPErrorWithJsonFailure(): HTTPError {
  const response = {
    status: 502,
    json: () => Promise.reject(new SyntaxError("Unexpected token")),
  } as Response;
  return new HTTPError(
    response,
    new Request("https://api.test/login"),
    {} as NormalizedOptions
  );
}

describe("parseLoginError", () => {
  beforeAll(async () => {
    await i18next.init({
      lng: "en",
      resources: { en: { common: resources.en.common } },
      defaultNS: "common",
      interpolation: { escapeValue: false },
    });
  });

  it("should return first non_field_errors entry", async () => {
    const error = createHTTPError({
      non_field_errors: ["Invalid credentials", "Second error"],
    });
    expect(await parseLoginError(error)).toBe("Invalid credentials");
  });

  it("should return detail string", async () => {
    const error = createHTTPError({ detail: "Account locked" });
    expect(await parseLoginError(error)).toBe("Account locked");
  });

  it("should return server error message when JSON parsing fails", async () => {
    const error = createHTTPErrorWithJsonFailure();
    expect(await parseLoginError(error)).toBe(
      "Server error (502). Please try again later."
    );
  });

  it('should return "Invalid credentials" for empty body', async () => {
    const error = createHTTPError({});
    expect(await parseLoginError(error)).toBe("Invalid credentials");
  });

  it("should return timeout message for AbortError", async () => {
    const abortError = new DOMException(
      "The operation was aborted",
      "AbortError"
    );
    expect(await parseLoginError(abortError)).toBe(
      "Request timed out. Please try again."
    );
  });

  it("should return connection error message for TypeError", async () => {
    expect(await parseLoginError(new TypeError("Failed to fetch"))).toBe(
      "Unable to reach the server. Please check your connection."
    );
  });

  it('should return "An unexpected error occurred" for non-HTTPError', async () => {
    expect(await parseLoginError(new Error("Network failure"))).toBe(
      "An unexpected error occurred"
    );
  });
});

describe("loginApi", () => {
  it("should call correct endpoint with login data", async () => {
    const { api, jsonMockFn } = await vi.importMock<{
      api: { post: ReturnType<typeof vi.fn> };
      jsonMockFn: ReturnType<typeof vi.fn>;
    }>("@/shared/api");

    jsonMockFn.mockResolvedValue({ key: "abc123" });

    const result = await loginApi({ email: "a@b.com", password: "pass" });

    expect(api.post).toHaveBeenCalledWith("auth/login/", {
      json: { email: "a@b.com", password: "pass" },
    });
    expect(result).toEqual({ key: "abc123" });
  });
});
