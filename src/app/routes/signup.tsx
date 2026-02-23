import { signupAction, SignupPage } from "@/pages/signup";
import {
  generateMeta,
  getLocaleFromMatches,
  getSeoTranslation,
} from "@/shared/lib/seo";
import { RouteErrorFallback } from "@/shared/ui/error-boundary";

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

export const ErrorBoundary = RouteErrorFallback;

export default SignupPage;

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  return signupAction(formData);
}
