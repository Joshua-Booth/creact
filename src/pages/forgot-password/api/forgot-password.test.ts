import { describe, expect, it, vi } from "vitest";

import { forgotPasswordApi } from "./forgot-password";

vi.mock("@/shared/api", () => {
  const postMock = vi.fn(() => Promise.resolve());
  return { api: { post: postMock } };
});

describe("forgotPasswordApi", () => {
  it("should call correct endpoint with email data", async () => {
    const { api } = await vi.importMock<{
      api: { post: ReturnType<typeof vi.fn> };
    }>("@/shared/api");

    await forgotPasswordApi({ email: "user@example.com" });

    expect(api.post).toHaveBeenCalledWith("auth/password/reset/", {
      json: { email: "user@example.com" },
    });
  });

  it("should propagate API errors", async () => {
    const { api } = await vi.importMock<{
      api: { post: ReturnType<typeof vi.fn> };
    }>("@/shared/api");

    api.post.mockRejectedValue(new Error("Network error"));

    await expect(
      forgotPasswordApi({ email: "user@example.com" })
    ).rejects.toThrow("Network error");
  });
});
