import { describe, expect, it, vi } from "vitest";

import { setAuthTokenAndRedirect } from "@/entities/user";

import { parseSignupError, signupApi } from "../api/signup";
import { signupAction } from "./action";

vi.mock("../api/signup", () => ({
  signupApi: vi.fn(),
  parseSignupError: vi.fn(),
}));

vi.mock("@/entities/user", () => ({
  setAuthTokenAndRedirect: vi.fn(),
}));

describe("signupAction", () => {
  it("should return validation error for invalid email", async () => {
    const formData = new FormData();
    formData.set("email", "not-an-email");
    formData.set("password", "Password1");
    formData.set("confirmPassword", "Password1");

    const result = await signupAction(formData);

    expect(result).toEqual(
      expect.objectContaining({
        success: false,
        error: expect.any(String) as string,
      })
    );
  });

  it("should return validation error for weak password", async () => {
    const formData = new FormData();
    formData.set("email", "user@example.com");
    formData.set("password", "weak");
    formData.set("confirmPassword", "weak");

    const result = await signupAction(formData);

    expect(result).toEqual(
      expect.objectContaining({
        success: false,
        error: expect.any(String) as string,
      })
    );
  });

  it("should return validation error for password mismatch", async () => {
    const formData = new FormData();
    formData.set("email", "user@example.com");
    formData.set("password", "Password1");
    formData.set("confirmPassword", "Password2");

    const result = await signupAction(formData);

    expect(result).toEqual(
      expect.objectContaining({
        success: false,
        error: expect.any(String) as string,
      })
    );
  });

  it("should call setAuthTokenAndRedirect on successful signup", async () => {
    const mockResponse = new Response(null, { status: 302 });
    vi.mocked(signupApi).mockResolvedValue({ key: "new-token" });
    vi.mocked(setAuthTokenAndRedirect).mockReturnValue(mockResponse);

    const formData = new FormData();
    formData.set("email", "user@example.com");
    formData.set("password", "Password1");
    formData.set("confirmPassword", "Password1");

    const result = await signupAction(formData);

    expect(signupApi).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "Password1",
    });
    expect(setAuthTokenAndRedirect).toHaveBeenCalledWith("new-token");
    expect(result).toBe(mockResponse);
  });

  it("should return parsed error when API throws", async () => {
    vi.mocked(signupApi).mockRejectedValue(new Error("API error"));
    vi.mocked(parseSignupError).mockResolvedValue("Email already exists");

    const formData = new FormData();
    formData.set("email", "user@example.com");
    formData.set("password", "Password1");
    formData.set("confirmPassword", "Password1");

    const result = await signupAction(formData);

    expect(parseSignupError).toHaveBeenCalled();
    expect(result).toEqual({ success: false, error: "Email already exists" });
  });
});
