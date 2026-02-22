import { HTTPError } from "ky";

import { api } from "@/shared/api";
import { AUTH_URLS } from "@/shared/config";

import type { ForgotPasswordFormData } from "../model/schema";

export async function forgotPasswordApi(
  data: ForgotPasswordFormData
): Promise<void> {
  await api.post(AUTH_URLS.FORGOT_PASSWORD, { json: data });
}

export async function parseForgotPasswordError(
  error: unknown
): Promise<string> {
  if (error instanceof HTTPError) {
    try {
      const body: { detail?: string } = await error.response.json();
      return body.detail ?? "Something went wrong. Please try again later.";
    } catch {
      return `Server error (${String(error.response.status)}). Please try again later.`;
    }
  }
  console.error("[ForgotPassword] Non-HTTP error:", error);
  if (error instanceof DOMException && error.name === "AbortError") {
    return "Request timed out. Please try again.";
  }
  if (error instanceof TypeError) {
    return "Unable to reach the server. Please check your connection.";
  }
  return "An unexpected error occurred";
}
