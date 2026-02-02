import { HTTPError } from "ky";

import { api } from "@/shared/api";
import { AUTH_URLS } from "@/shared/config";

import type { RegisterFormData } from "../model/schema";

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
    // eslint-disable-next-line promise/no-promise-in-callback -- Intentional: gracefully handle JSON parse errors
    const body = (await error.response
      .json()
      .catch(() => ({}))) as SignupErrorResponse;
    return (
      body.email?.[0] ??
      body.password?.[0] ??
      body.non_field_errors?.[0] ??
      body.detail ??
      "Registration failed"
    );
  }
  return "An unexpected error occurred";
}
