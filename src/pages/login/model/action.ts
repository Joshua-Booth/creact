import { setAuthTokenAndRedirect } from "@/entities/user";

import { loginApi, parseLoginError } from "../api/login";
import { loginSchema } from "./schema";

export interface LoginActionData {
  success: false;
  error: string;
}

export async function loginAction(
  formData: FormData
): Promise<LoginActionData | Response> {
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    return {
      success: false,
      /* istanbul ignore next -- Zod always provides at least one issue */
      error: result.error.issues[0]?.message ?? "Invalid form data",
    };
  }

  try {
    const response = await loginApi(result.data);
    return setAuthTokenAndRedirect(response.key);
  } catch (error) {
    const message = await parseLoginError(error);
    return { success: false, error: message };
  }
}
