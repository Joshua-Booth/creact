import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import { useTranslation } from "react-i18next";

import * as Sentry from "@sentry/react";
import { AlertTriangle, Home } from "lucide-react";

import { buttonVariants } from "../button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../empty";

/** Route-level error fallback that displays within the existing page layout. */
export function RouteErrorFallback() {
  const { t } = useTranslation();
  const error = useRouteError();

  if (!isRouteErrorResponse(error)) {
    Sentry.captureException(error);
  }

  const isRouteError = isRouteErrorResponse(error);

  return (
    <Empty className="min-h-100">
      <EmptyHeader>
        <EmptyMedia
          variant="icon"
          className="bg-destructive/10 text-destructive rounded-full"
        >
          <AlertTriangle />
        </EmptyMedia>
        <EmptyTitle>
          {isRouteError
            ? `${error.status}: ${error.statusText}`
            : t("errors.routeError")}
        </EmptyTitle>
        <EmptyDescription>{t("errors.routeErrorDescription")}</EmptyDescription>
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
