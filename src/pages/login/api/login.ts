import i18next from "i18next";

import { api, apiErrorMessage } from "@/shared/api";
import { AUTH_URLS } from "@/shared/config";

import type { LoginFormData } from "../model/schema";

interface LoginResponse {
  key: string;
}

export async function loginApi(data: LoginFormData): Promise<LoginResponse> {
  return api.post(AUTH_URLS.LOGIN, { json: data }).json<LoginResponse>();
}

export function parseLoginError(error: unknown): string {
  return apiErrorMessage(error, {
    fields: [
      { key: "non_field_errors", shape: "list" },
      { key: "detail", shape: "text" },
    ],
    fallback: i18next.t("errors.api.invalidCredentials"),
    logLabel: "[Login]",
  });
}
