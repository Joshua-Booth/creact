import { parseSignupError, signupApi } from "../api/signup";

export type SignupActionData =
  | { success: true; token: string }
  | { success: false; error: string };

export async function signupAction(
  formData: FormData
): Promise<SignupActionData> {
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  try {
    const response = await signupApi(data);
    return { success: true, token: response.key };
  } catch (error) {
    const message = await parseSignupError(error);
    return { success: false, error: message };
  }
}
