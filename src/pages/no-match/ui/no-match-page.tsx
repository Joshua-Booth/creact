import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import { useTranslation } from "react-i18next";

import { Home, SearchX } from "lucide-react";

import { buttonVariants } from "@/shared/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/ui/empty";

export function NoMatchPage() {
  const { t } = useTranslation();
  const error = useRouteError();

  return (
    <Empty className="min-h-100">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchX />
        </EmptyMedia>
        <EmptyTitle render={<h1 />}>{t("pages.notFound.heading")}</EmptyTitle>
        <EmptyDescription>{t("errors.notFoundDescription")}</EmptyDescription>
        {isRouteErrorResponse(error) && (
          <EmptyDescription>
            {error.status}: {error.statusText}
          </EmptyDescription>
        )}
      </EmptyHeader>
      <EmptyContent>
        <Link to="/" className={buttonVariants({ variant: "outline" })}>
          <Home />
          {t("errors.goHome")}
        </Link>
      </EmptyContent>
    </Empty>
  );
}
