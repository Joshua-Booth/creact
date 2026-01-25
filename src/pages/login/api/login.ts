import { HTTPError } from "ky";

import type { LoginFormData } from "@/shared/lib/validation";
import { api } from "@/shared/api";
import { AUTH_URLS } from "@/shared/config";

interface LoginResponse {
  key: string;
}

interface LoginErrorResponse {
  non_field_errors?: string[];
  detail?: string;
}

export async function loginApi(data: LoginFormData): Promise<LoginResponse> {
  return api
    .post(AUTH_URLS.LOGIN.slice(1), { json: data })
    .json<LoginResponse>();
}

export async function parseLoginError(error: unknown): Promise<string> {
  if (error instanceof HTTPError) {
    const body = await error.response.json().catch(() => ({}));
    const response = body as LoginErrorResponse;
    return (
      response.non_field_errors?.[0] || response.detail || "Invalid credentials"
    );
  }
  return "An unexpected error occurred";
}
