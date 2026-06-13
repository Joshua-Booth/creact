import { describe, expect, it } from "vitest";

import { ApiError, applyAuthHeader } from "./client";

describe("ApiError", () => {
  it("should create an error with message, status, and response", () => {
    const error = new ApiError("Not Found", 404, { detail: "missing" });

    expect(error.message).toBe("Not Found");
    expect(error.name).toBe("ApiError");
    expect(error.status).toBe(404);
    expect(error.response).toEqual({ detail: "missing" });
    expect(error).toBeInstanceOf(Error);
  });

  it("should default response to undefined when not provided", () => {
    const error = new ApiError("Server Error", 500);

    expect(error.status).toBe(500);
    expect(error.response).toBeUndefined();
  });
});

describe("applyAuthHeader", () => {
  it("sets the bearer token header when a token is present", () => {
    const headers = new Headers();
    applyAuthHeader(headers, "abc123");
    expect(headers.get("Authorization")).toBe("Token abc123");
  });

  it("leaves the header untouched when the token is null", () => {
    const headers = new Headers();
    applyAuthHeader(headers, null);
    expect(headers.get("Authorization")).toBeNull();
  });
});
