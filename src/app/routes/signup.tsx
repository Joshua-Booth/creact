import { SignupPage, signupAction } from "@/pages/signup";

import type { Route } from "./+types/signup";

export default SignupPage;

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  return signupAction(formData);
}
