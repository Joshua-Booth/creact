import { describe, expect, it } from "vitest";

import { ApiError } from "./client";

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
