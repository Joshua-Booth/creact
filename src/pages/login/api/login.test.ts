import type { NormalizedOptions } from "ky";
import { HTTPError } from "ky";
import { describe, expect, it } from "vitest";

import { parseLoginError } from "./login";

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
    json: () => Promise.reject(new SyntaxError("Unexpected token")),
  } as Response;
  return new HTTPError(
    response,
    new Request("https://api.test/login"),
    {} as NormalizedOptions
  );
}

describe("parseLoginError", () => {
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

  it('should return "Invalid credentials" when JSON parsing fails', async () => {
    const error = createHTTPErrorWithJsonFailure();
    expect(await parseLoginError(error)).toBe("Invalid credentials");
  });

  it('should return "Invalid credentials" for empty body', async () => {
    const error = createHTTPError({});
    expect(await parseLoginError(error)).toBe("Invalid credentials");
  });

  it('should return "An unexpected error occurred" for non-HTTPError', async () => {
    expect(await parseLoginError(new Error("Network failure"))).toBe(
      "An unexpected error occurred"
    );
  });
});
