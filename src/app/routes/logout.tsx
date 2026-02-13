import { LogoutPage } from "@/pages/logout";
import { generateMeta } from "@/shared/lib/seo";
import { RouteErrorFallback } from "@/shared/ui/error-boundary";

export function meta() {
  return generateMeta({
    title: "Logout",
    description: "Signing out of your account.",
    noIndex: true,
  });
}

export const ErrorBoundary = RouteErrorFallback;

export default LogoutPage;
