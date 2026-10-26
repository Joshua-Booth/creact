import type { NormalizedOptions } from "ky";
import i18next from "i18next";
import { HTTPError } from "ky";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { resources } from "@/shared/i18n";

import { apiErrorMessage } from "./api-error";

const options = {
  fields: [
    { key: "email", shape: "list" },
    { key: "non_field_errors", shape: "list" },
    { key: "detail", shape: "text" },
  ],
  fallback: "Fallback message",
  logLabel: "[Test]",
} as const;

function createHTTPError(body: unknown, status = 400): HTTPError {
  const response = { status } as Response;
  const error = new HTTPError(
    response,
    new Request("https://api.test/endpoint"),
    {} as NormalizedOptions
  );
  error.data = body;
  return error;
}

describe("apiErrorMessage", () => {
  beforeAll(async () => {
    await i18next.init({
      lng: "en",
      resources: { en: { common: resources.en.common } },
      defaultNS: "common",
      interpolation: { escapeValue: false },
    });
  });

  it("should return the first item of a list field", () => {
    const error = createHTTPError({ email: ["Email taken", "Second"] });
    expect(apiErrorMessage(error, options)).toBe("Email taken");
  });

  it("should return a text field", () => {
    const error = createHTTPError({ detail: "Account locked" });
    expect(apiErrorMessage(error, options)).toBe("Account locked");
  });

  it("should follow the field order", () => {
    const error = createHTTPError({
      detail: "Detail message",
      non_field_errors: ["Non-field message"],
      email: ["Email message"],
    });
    expect(apiErrorMessage(error, options)).toBe("Email message");
  });

  it("should skip an empty list", () => {
    const error = createHTTPError({ email: [], detail: "Detail message" });
    expect(apiErrorMessage(error, options)).toBe("Detail message");
  });

  it("should skip a list field that is not an array", () => {
    const error = createHTTPError({
      email: "Not a list",
      detail: "Detail message",
    });
    expect(apiErrorMessage(error, options)).toBe("Detail message");
  });

  it("should skip a list item that is not a string", () => {
    const error = createHTTPError({
      email: [{ code: "taken" }],
      detail: "Detail message",
    });
    expect(apiErrorMessage(error, options)).toBe("Detail message");
  });

  it("should skip a text field that is not a string", () => {
    const error = createHTTPError({ detail: 42 });
    expect(apiErrorMessage(error, options)).toBe("Fallback message");
  });

  it("should return the fallback when no field matches", () => {
    const error = createHTTPError({ other: "Ignored" });
    expect(apiErrorMessage(error, options)).toBe("Fallback message");
  });

  it("should return the server error message when the body is not an object", () => {
    const error = createHTTPError(undefined, 502);
    expect(apiErrorMessage(error, options)).toBe(
      "Server error (502). Please try again later."
    );
  });

  it("should return the server error message when the body is null", () => {
    const error = createHTTPError(null, 500);
    expect(apiErrorMessage(error, options)).toBe(
      "Server error (500). Please try again later."
    );
  });

  it("should return the timeout message for an AbortError", () => {
    vi.spyOn(console, "error").mockImplementation(vi.fn());
    const abortError = new DOMException(
      "The operation was aborted",
      "AbortError"
    );
    expect(apiErrorMessage(abortError, options)).toBe(
      "Request timed out. Please try again."
    );
  });

  it("should return the connection message for a TypeError", () => {
    vi.spyOn(console, "error").mockImplementation(vi.fn());
    expect(apiErrorMessage(new TypeError("Failed to fetch"), options)).toBe(
      "Unable to reach the server. Please check your connection."
    );
  });

  it("should return the unexpected message and log with the label for other errors", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(vi.fn());
    const error = new Error("Boom");

    expect(apiErrorMessage(error, options)).toBe(
      "An unexpected error occurred"
    );
    expect(errorSpy).toHaveBeenCalledWith("[Test] Non-HTTP error:", error);
  });

  it("should not log for an HTTP error", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(vi.fn());
    apiErrorMessage(createHTTPError({}), options);
    expect(errorSpy).not.toHaveBeenCalled();
  });
});
