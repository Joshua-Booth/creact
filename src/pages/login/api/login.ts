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
  return api.post(AUTH_URLS.LOGIN, { json: data }).json<LoginResponse>();
}

export async function parseLoginError(error: unknown): Promise<string> {
  if (error instanceof HTTPError) {
    try {
      const body: LoginErrorResponse = await error.response.json();
      return body.non_field_errors?.[0] ?? body.detail ?? "Invalid credentials";
    } catch {
      return `Server error (${String(error.response.status)}). Please try again later.`;
    }
  }
  console.error("[Login] Non-HTTP error:", error);
  if (error instanceof DOMException && error.name === "AbortError") {
    return "Request timed out. Please try again.";
  }
  if (error instanceof TypeError) {
    return "Unable to reach the server. Please check your connection.";
  }
  return "An unexpected error occurred";
}
