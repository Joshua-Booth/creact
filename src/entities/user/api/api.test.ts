import { describe, expect, it, vi } from "vitest";

import { fetchUserFromApi } from "./api";

vi.mock("@/shared/api", () => {
  const jsonMock = vi.fn();
  const getMock = vi.fn(() => ({ json: jsonMock }));
  return { api: { get: getMock }, jsonMockFn: jsonMock };
});

describe("fetchUserFromApi", () => {
  it("should call correct endpoint with auth header", async () => {
    const { api, jsonMockFn } = await vi.importMock<{
      api: { get: ReturnType<typeof vi.fn> };
      jsonMockFn: ReturnType<typeof vi.fn>;
    }>("@/shared/api");

    const mockUser = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
    };
    jsonMockFn.mockResolvedValue(mockUser);

    const result = await fetchUserFromApi("my-token");

    expect(api.get).toHaveBeenCalledWith("auth/user/", {
      headers: { Authorization: "Token my-token" },
    });
    expect(result).toEqual(mockUser);
  });
});
