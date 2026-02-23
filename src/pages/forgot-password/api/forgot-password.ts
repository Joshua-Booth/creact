import { api } from "@/shared/api";
import { AUTH_URLS } from "@/shared/config";

import type { ForgotPasswordFormData } from "../model/schema";

export async function forgotPasswordApi(
  data: ForgotPasswordFormData
): Promise<void> {
  await api.post(AUTH_URLS.FORGOT_PASSWORD, { json: data });
}
