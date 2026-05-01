import i18next from "i18next";
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

export function parseSignupError(error: unknown): string {
  if (error instanceof HTTPError) {
    const body: unknown = error.data;
    if (typeof body === "object" && body !== null) {
      const parsed = body as SignupErrorResponse;
      return (
        parsed.email?.[0] ??
        parsed.password?.[0] ??
        parsed.non_field_errors?.[0] ??
        parsed.detail ??
        i18next.t("errors.api.registrationFailed")
      );
    }
    return i18next.t("errors.api.serverError", {
      status: String(error.response.status),
    });
  }
  console.error("[Signup] Non-HTTP error:", error);
  if (error instanceof DOMException && error.name === "AbortError") {
    return i18next.t("errors.api.requestTimeout");
  }
  if (error instanceof TypeError) {
    return i18next.t("errors.api.networkError");
  }
  return i18next.t("errors.api.unexpectedError");
}
