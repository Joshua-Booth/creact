import { describe, expect, it, vi } from "vitest";

import { setAuthTokenAndRedirect } from "@/entities/user";

import { loginApi, parseLoginError } from "../api/login";
import { loginAction } from "./action";

vi.mock("../api/login", () => ({
  loginApi: vi.fn(),
  parseLoginError: vi.fn(),
}));

vi.mock("@/entities/user", () => ({
  setAuthTokenAndRedirect: vi.fn(),
}));

describe("loginAction", () => {
  it("should return validation error for missing email", async () => {
    const formData = new FormData();
    formData.set("email", "");
    formData.set("password", "password123");

    const result = await loginAction(formData);

    expect(result).toEqual(
      expect.objectContaining({
        success: false,
        error: expect.any(String) as string,
      })
    );
  });

  it("should return validation error for missing password", async () => {
    const formData = new FormData();
    formData.set("email", "user@example.com");
    formData.set("password", "");

    const result = await loginAction(formData);

    expect(result).toEqual(
      expect.objectContaining({
        success: false,
        error: expect.any(String) as string,
      })
    );
  });

  it("should call setAuthTokenAndRedirect on successful login", async () => {
    const mockResponse = new Response(null, { status: 302 });
    vi.mocked(loginApi).mockResolvedValue({ key: "test-token" });
    vi.mocked(setAuthTokenAndRedirect).mockReturnValue(mockResponse);

    const formData = new FormData();
    formData.set("email", "user@example.com");
    formData.set("password", "password123");

    const result = await loginAction(formData);

    expect(loginApi).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password123",
    });
    expect(setAuthTokenAndRedirect).toHaveBeenCalledWith("test-token");
    expect(result).toBe(mockResponse);
  });

  it("should return parsed error when API throws", async () => {
    vi.mocked(loginApi).mockRejectedValue(new Error("API error"));
    vi.mocked(parseLoginError).mockResolvedValue("Invalid credentials");

    const formData = new FormData();
    formData.set("email", "user@example.com");
    formData.set("password", "password123");

    const result = await loginAction(formData);

    expect(parseLoginError).toHaveBeenCalled();
    expect(result).toEqual({ success: false, error: "Invalid credentials" });
  });
});
