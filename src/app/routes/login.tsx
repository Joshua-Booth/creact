import { loginAction, LoginPage } from "@/pages/login";
import {
  generateMeta,
  getLocaleFromMatches,
  getSeoTranslation,
} from "@/shared/lib/seo";
import { RouteErrorFallback } from "@/shared/ui/error-boundary";

import type { Route } from "./+types/login";

export function meta({ matches }: Route.MetaArgs) {
  const locale = getLocaleFromMatches(matches);
  const seo = getSeoTranslation(locale, "login");

  return generateMeta({
    title: seo.title,
    description: seo.description,
    noIndex: true,
  });
}

export const ErrorBoundary = RouteErrorFallback;

export default LoginPage;

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  return loginAction(formData);
}
