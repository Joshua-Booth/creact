import { redirect } from "react-router";

import { loginApi, parseLoginError } from "../api/login";

export type LoginActionData = { success: false; error: string };

export async function loginAction(
  formData: FormData
): Promise<LoginActionData | Response> {
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  try {
    const response = await loginApi(data);
    // Store token directly - zustand will rehydrate from localStorage
    localStorage.setItem("token", response.key);
    localStorage.setItem(
      "auth-storage",
      JSON.stringify({ state: { token: response.key, authenticated: true } })
    );
    return redirect("/dashboard");
  } catch (error) {
    const message = await parseLoginError(error);
    return { success: false, error: message };
  }
}
