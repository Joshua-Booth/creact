import { signupAction, SignupPage } from "@/pages/signup";
import {
  generateMeta,
  getLocaleFromMatches,
  getSeoTranslation,
} from "@/shared/lib/seo";

import type { Route } from "./+types/signup";

export function meta({ matches }: Route.MetaArgs) {
  const locale = getLocaleFromMatches(matches);
  const seo = getSeoTranslation(locale, "signup");

  return generateMeta({
    title: seo.title,
    description: seo.description,
    noIndex: true,
  });
}

export default SignupPage;

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  return signupAction(formData);
}
