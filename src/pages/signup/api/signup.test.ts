import type { NormalizedOptions } from "ky";
import { HTTPError } from "ky";
import { describe, expect, it } from "vitest";

import { parseSignupError } from "./signup";

function createHTTPError(body: unknown): HTTPError {
  const response = {
    json: () => Promise.resolve(body),
  } as Response;
  return new HTTPError(
    response,
    new Request("https://api.test/signup"),
    {} as NormalizedOptions
  );
}

function createHTTPErrorWithJsonFailure(): HTTPError {
  const response = {
    json: () => Promise.reject(new SyntaxError("Unexpected token")),
  } as Response;
  return new HTTPError(
    response,
    new Request("https://api.test/signup"),
    {} as NormalizedOptions
  );
}

describe("parseSignupError", () => {
  it("should return first email error", async () => {
    const error = createHTTPError({
      email: ["Email already exists", "Invalid email"],
    });
    expect(await parseSignupError(error)).toBe("Email already exists");
  });

  it("should return first password error", async () => {
    const error = createHTTPError({
      password: ["Password too weak"],
    });
    expect(await parseSignupError(error)).toBe("Password too weak");
  });

  it("should return first non_field_errors entry", async () => {
    const error = createHTTPError({
      non_field_errors: ["Registration is disabled"],
    });
    expect(await parseSignupError(error)).toBe("Registration is disabled");
  });

  it("should return detail string", async () => {
    const error = createHTTPError({ detail: "Service unavailable" });
    expect(await parseSignupError(error)).toBe("Service unavailable");
  });

  it("should prioritize email over password errors", async () => {
    const error = createHTTPError({
      email: ["Email taken"],
      password: ["Too short"],
    });
    expect(await parseSignupError(error)).toBe("Email taken");
  });

  it('should return "Registration failed" when JSON parsing fails', async () => {
    const error = createHTTPErrorWithJsonFailure();
    expect(await parseSignupError(error)).toBe("Registration failed");
  });

  it('should return "Registration failed" for empty body', async () => {
    const error = createHTTPError({});
    expect(await parseSignupError(error)).toBe("Registration failed");
  });

  it('should return "An unexpected error occurred" for non-HTTPError', async () => {
    expect(await parseSignupError(new Error("Network failure"))).toBe(
      "An unexpected error occurred"
    );
  });
});
