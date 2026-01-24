import { redirect } from "react-router";

import { parseSignupError, signupApi } from "../api/signup";

export type SignupActionData = { success: false; error: string };

export async function signupAction(
  formData: FormData
): Promise<SignupActionData | Response> {
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  try {
    const response = await signupApi(data);
    localStorage.setItem("token", response.key);
    localStorage.setItem(
      "auth-storage",
      JSON.stringify({ state: { token: response.key, authenticated: true } })
    );
    return redirect("/dashboard");
  } catch (error) {
    const message = await parseSignupError(error);
    return { success: false, error: message };
  }
}
