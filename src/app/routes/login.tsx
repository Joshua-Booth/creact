import { LoginPage, loginAction } from "@/pages/login";

import type { Route } from "./+types/login";

export default LoginPage;

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  return loginAction(formData);
}
