import i18next from "i18next";
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

export function parseLoginError(error: unknown): string {
  if (error instanceof HTTPError) {
    const body: unknown = error.data;
    if (typeof body === "object" && body !== null) {
      const parsed = body as LoginErrorResponse;
      return (
        parsed.non_field_errors?.[0] ??
        parsed.detail ??
        i18next.t("errors.api.invalidCredentials")
      );
    }
    return i18next.t("errors.api.serverError", {
      status: String(error.response.status),
    });
  }
  console.error("[Login] Non-HTTP error:", error);
  if (error instanceof DOMException && error.name === "AbortError") {
    return i18next.t("errors.api.requestTimeout");
  }
  if (error instanceof TypeError) {
    return i18next.t("errors.api.networkError");
  }
  return i18next.t("errors.api.unexpectedError");
}
