import { href, Link } from "react-router";
import { useTranslation } from "react-i18next";

import { LogIn, LogOut } from "lucide-react";

import { buttonVariants } from "@/shared/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/ui/empty";

/**
 * Post-logout confirmation page with navigation options.
 * @returns `<Empty>` state with a logout icon, confirmation message, and a "Back to Login" link.
 */
export function LogoutPage() {
  const { t } = useTranslation();

  return (
    <Empty className="min-h-100">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <LogOut />
        </EmptyMedia>
        <EmptyTitle render={<h1 />}>{t("pages.logout.heading")}</EmptyTitle>
        <EmptyDescription>{t("pages.logout.description")}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link
          to={href("/login")}
          className={buttonVariants({ variant: "outline" })}
        >
          <LogIn />
          {t("pages.logout.backToLogin")}
        </Link>
      </EmptyContent>
    </Empty>
  );
}
