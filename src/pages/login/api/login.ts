import { HTTPError } from "ky";

import { api } from "@/shared/api";
import { AUTH_URLS } from "@/shared/config";

import type { LoginFormData } from "../model/schema";

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
    // eslint-disable-next-line promise/no-promise-in-callback -- Intentional: gracefully handle JSON parse errors
    const body = (await error.response
      .json()
      .catch(() => ({}))) as LoginErrorResponse;
    return body.non_field_errors?.[0] ?? body.detail ?? "Invalid credentials";
  }
  return "An unexpected error occurred";
}
