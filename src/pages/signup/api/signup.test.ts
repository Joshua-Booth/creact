import type { NormalizedOptions } from "ky";
import i18next from "i18next";
import { HTTPError } from "ky";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { resources } from "@/shared/i18n";

import { parseSignupError, signupApi } from "./signup";

vi.mock("@/shared/api", () => {
  const jsonMock = vi.fn();
  const postMock = vi.fn(() => ({ json: jsonMock }));
  return { api: { post: postMock }, jsonMockFn: jsonMock };
});

function createHTTPError(body: unknown): HTTPError {
  const response = {} as Response;
  const error = new HTTPError(
    response,
    new Request("https://api.test/signup"),
    {} as NormalizedOptions
  );
  error.data = body;
  return error;
}

function createHTTPErrorWithJsonFailure(): HTTPError {
  const response = { status: 502 } as Response;
  return new HTTPError(
    response,
    new Request("https://api.test/signup"),
    {} as NormalizedOptions
  );
}

describe("parseSignupError", () => {
  beforeAll(async () => {
    await i18next.init({
      lng: "en",
      resources: { en: { common: resources.en.common } },
      defaultNS: "common",
      interpolation: { escapeValue: false },
    });
  });

  it("should return first email error", () => {
    const error = createHTTPError({
      email: ["Email already exists", "Invalid email"],
    });
    expect(parseSignupError(error)).toBe("Email already exists");
  });

  it("should return first password error", () => {
    const error = createHTTPError({
      password: ["Password too weak"],
    });
    expect(parseSignupError(error)).toBe("Password too weak");
  });

  it("should return first non_field_errors entry", () => {
    const error = createHTTPError({
      non_field_errors: ["Registration is disabled"],
    });
    expect(parseSignupError(error)).toBe("Registration is disabled");
  });

  it("should return detail string", () => {
    const error = createHTTPError({ detail: "Service unavailable" });
    expect(parseSignupError(error)).toBe("Service unavailable");
  });

  it("should prioritize email over password errors", () => {
    const error = createHTTPError({
      email: ["Email taken"],
      password: ["Too short"],
    });
    expect(parseSignupError(error)).toBe("Email taken");
  });

  it("should return server error message when JSON parsing fails", () => {
    const error = createHTTPErrorWithJsonFailure();
    expect(parseSignupError(error)).toBe(
      "Server error (502). Please try again later."
    );
  });

  it('should return "Registration failed" for empty body', () => {
    const error = createHTTPError({});
    expect(parseSignupError(error)).toBe("Registration failed");
  });

  it("should return timeout message for AbortError", () => {
    const abortError = new DOMException(
      "The operation was aborted",
      "AbortError"
    );
    expect(parseSignupError(abortError)).toBe(
      "Request timed out. Please try again."
    );
  });

  it("should return connection error message for TypeError", () => {
    expect(parseSignupError(new TypeError("Failed to fetch"))).toBe(
      "Unable to reach the server. Please check your connection."
    );
  });

  it('should return "An unexpected error occurred" for non-HTTPError', () => {
    expect(parseSignupError(new Error("Network failure"))).toBe(
      "An unexpected error occurred"
    );
  });
});

describe("signupApi", () => {
  it("should call correct endpoint with signup data", async () => {
    const { api, jsonMockFn } = await vi.importMock<{
      api: { post: ReturnType<typeof vi.fn> };
      jsonMockFn: ReturnType<typeof vi.fn>;
    }>("@/shared/api");

    jsonMockFn.mockResolvedValue({ key: "xyz789" });

    const result = await signupApi({ email: "a@b.com", password: "pass123" });

    expect(api.post).toHaveBeenCalledWith("auth/signup/", {
      json: { email: "a@b.com", password: "pass123" },
    });
    expect(result).toEqual({ key: "xyz789" });
  });
});
