import i18next from "i18next";

import { setAuthTokenAndRedirect } from "@/entities/user";

import { parseSignupError, signupApi } from "../api/signup";
import { signupSchema } from "./schema";

export interface SignupActionData {
  success: false;
  error: string;
}

export async function signupAction(
  formData: FormData
): Promise<SignupActionData | Response> {
  const result = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
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
    const response = await signupApi({
      email: result.data.email,
      password: result.data.password,
    });
    return setAuthTokenAndRedirect(response.key);
  } catch (error) {
    const message = await parseSignupError(error);
    return { success: false, error: message };
  }
}
