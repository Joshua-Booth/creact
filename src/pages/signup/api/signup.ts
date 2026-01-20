import { HTTPError } from "ky";

import { api } from "@/shared/api";
import { AUTH_URLS } from "@/shared/config";
import type { RegisterFormData } from "@/shared/lib/validation";

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
  data: Omit<RegisterFormData, "confirmPassword">
): Promise<SignupResponse> {
  return api
    .post(AUTH_URLS.SIGNUP.slice(1), { json: data })
    .json<SignupResponse>();
}

export async function parseSignupError(error: unknown): Promise<string> {
  if (error instanceof HTTPError) {
    const body = await error.response.json().catch(() => ({}));
    const response = body as SignupErrorResponse;
    return (
      response.email?.[0] ||
      response.password?.[0] ||
      response.non_field_errors?.[0] ||
      response.detail ||
      "Registration failed"
    );
  }
  return "An unexpected error occurred";
}
