import i18next from "i18next";

import { api, apiErrorMessage } from "@/shared/api";
import { AUTH_URLS } from "@/shared/config";

import type { SignupFormData } from "../model/schema";

interface SignupResponse {
  key: string;
}

export async function signupApi(
  data: Omit<SignupFormData, "confirmPassword">
): Promise<SignupResponse> {
  return api.post(AUTH_URLS.SIGNUP, { json: data }).json<SignupResponse>();
}

export function parseSignupError(error: unknown): string {
  return apiErrorMessage(error, {
    fields: [
      { key: "email", shape: "list" },
      { key: "password", shape: "list" },
      { key: "non_field_errors", shape: "list" },
      { key: "detail", shape: "text" },
    ],
    fallback: i18next.t("errors.api.registrationFailed"),
    logLabel: "[Signup]",
  });
}
