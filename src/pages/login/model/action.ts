import { loginApi, parseLoginError } from "../api/login";

export type LoginActionData =
  | { success: true; token: string }
  | { success: false; error: string };

export async function loginAction(
  formData: FormData
): Promise<LoginActionData> {
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  try {
    const response = await loginApi(data);
    return { success: true, token: response.key };
  } catch (error) {
    const message = await parseLoginError(error);
    return { success: false, error: message };
  }
}
