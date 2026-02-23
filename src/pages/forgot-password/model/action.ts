import i18next from "i18next";

import { forgotPasswordApi } from "../api/forgot-password";
import { forgotPasswordSchema } from "./schema";

export interface ForgotPasswordActionData {
  success: boolean;
  error?: string;
}

export async function forgotPasswordAction(
  formData: FormData
): Promise<ForgotPasswordActionData> {
  const result = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!result.success) {
    return {
      success: false,
      /* istanbul ignore next -- Zod always provides at least one issue */
      error:
        result.error.issues[0]?.message ??
        i18next.t("errors.api.invalidFormData"),
    };
  }

  try {
    await forgotPasswordApi(result.data);
    // Always show success to prevent email enumeration
    return { success: true };
  } catch {
    // Always show success to prevent email enumeration
    return { success: true };
  }
}
