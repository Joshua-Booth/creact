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
  it.each([
    {
      reason: "invalid email",
      email: "not-an-email",
      password: "Password1",
      confirmPassword: "Password1",
    },
    {
      reason: "weak password",
      email: "user@example.com",
      password: "weak",
      confirmPassword: "weak",
    },
    {
      reason: "password mismatch",
      email: "user@example.com",
      password: "Password1",
      confirmPassword: "Password2",
    },
  ])(
    "should return validation error for $reason",
    async ({ email, password, confirmPassword }) => {
      const formData = new FormData();
      formData.set("email", email);
      formData.set("password", password);
      formData.set("confirmPassword", confirmPassword);

      const result = await signupAction(formData);

      expect(result).toEqual(
        expect.objectContaining({
          success: false,
          error: expect.any(String) as string,
        })
      );
    }
  );

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
    vi.mocked(parseSignupError).mockReturnValue("Email already exists");

    const formData = new FormData();
    formData.set("email", "user@example.com");
    formData.set("password", "Password1");
    formData.set("confirmPassword", "Password1");

    const result = await signupAction(formData);

    expect(parseSignupError).toHaveBeenCalled();
    expect(result).toEqual({ success: false, error: "Email already exists" });
  });
});
