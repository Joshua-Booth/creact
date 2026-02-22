import { HTTPError } from "ky";

import { api } from "@/shared/api";
import { AUTH_URLS } from "@/shared/config";

import type { SignupFormData } from "../model/schema";

interface SignupResponse {
  key: string;
}

interface SignupErrorResponse {
  email?: string[];
  password?: string[];
  non_field_errors?: string[];
  detail?: string;
}

export async function signupApi(
  data: Omit<SignupFormData, "confirmPassword">
): Promise<SignupResponse> {
  return api.post(AUTH_URLS.SIGNUP, { json: data }).json<SignupResponse>();
}

export async function parseSignupError(error: unknown): Promise<string> {
  if (error instanceof HTTPError) {
    try {
      const body: SignupErrorResponse = await error.response.json();
      return (
        body.email?.[0] ??
        body.password?.[0] ??
        body.non_field_errors?.[0] ??
        body.detail ??
        "Registration failed"
      );
    } catch {
      return `Server error (${String(error.response.status)}). Please try again later.`;
    }
  }
  console.error("[Signup] Non-HTTP error:", error);
  if (error instanceof DOMException && error.name === "AbortError") {
    return "Request timed out. Please try again.";
  }
  if (error instanceof TypeError) {
    return "Unable to reach the server. Please check your connection.";
  }
  return "An unexpected error occurred";
}
