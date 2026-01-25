import { LogoutPage } from "@/pages/logout";
import { generateMeta } from "@/shared/lib/seo";

export function meta() {
  return generateMeta({
    title: "Logout",
    description: "Signing out of your account.",
    noIndex: true,
  });
}

export default LogoutPage;
