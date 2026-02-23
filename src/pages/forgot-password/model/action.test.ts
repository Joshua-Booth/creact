import { describe, expect, it, vi } from "vitest";

import { forgotPasswordApi } from "../api/forgot-password";
import { forgotPasswordAction } from "./action";

vi.mock("../api/forgot-password", () => ({
  forgotPasswordApi: vi.fn(),
}));

describe("forgotPasswordAction", () => {
  it("should return validation error for empty email", async () => {
    const formData = new FormData();
    formData.set("email", "");

    const result = await forgotPasswordAction(formData);

    expect(result).toEqual(
      expect.objectContaining({
        success: false,
        error: expect.any(String) as string,
      })
    );
    expect(forgotPasswordApi).not.toHaveBeenCalled();
  });

  it("should return validation error for invalid email", async () => {
    const formData = new FormData();
    formData.set("email", "not-an-email");

    const result = await forgotPasswordAction(formData);

    expect(result).toEqual(
      expect.objectContaining({
        success: false,
        error: expect.any(String) as string,
      })
    );
    expect(forgotPasswordApi).not.toHaveBeenCalled();
  });

  it("should return success for valid email", async () => {
    vi.mocked(forgotPasswordApi).mockResolvedValue();

    const formData = new FormData();
    formData.set("email", "user@example.com");

    const result = await forgotPasswordAction(formData);

    expect(forgotPasswordApi).toHaveBeenCalledWith({
      email: "user@example.com",
    });
    expect(result).toEqual({ success: true });
  });

  it("should return success even when API throws (anti-enumeration)", async () => {
    vi.mocked(forgotPasswordApi).mockRejectedValue(new Error("Not found"));

    const formData = new FormData();
    formData.set("email", "nonexistent@example.com");

    const result = await forgotPasswordAction(formData);

    expect(forgotPasswordApi).toHaveBeenCalledWith({
      email: "nonexistent@example.com",
    });
    expect(result).toEqual({ success: true });
  });
});
