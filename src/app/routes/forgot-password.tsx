import {
  forgotPasswordAction,
  ForgotPasswordPage,
} from "@/pages/forgot-password";
import {
  generateMeta,
  getLocaleFromMatches,
  getSeoTranslation,
} from "@/shared/lib/seo";
import { RouteErrorFallback } from "@/shared/ui/error-boundary";

import type { Route } from "./+types/forgot-password";

export function meta({ matches }: Route.MetaArgs) {
  const locale = getLocaleFromMatches(matches);
  const seo = getSeoTranslation(locale, "forgotPassword");

  return generateMeta({
    title: seo.title,
    description: seo.description,
    noIndex: true,
  });
}

export const ErrorBoundary = RouteErrorFallback;

export default ForgotPasswordPage;

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  return forgotPasswordAction(formData);
}
