import { Suspense } from "react";
import { useTranslation } from "react-i18next";

import { useCurrentUser } from "@/entities/user";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { ErrorBoundary } from "@/shared/ui/error-boundary";
import { Separator } from "@/shared/ui/separator";
import { Skeleton } from "@/shared/ui/skeleton";

function DashboardSkeleton() {
  return (
    <>
      <div className="mb-10">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-16" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Skeleton className="size-10 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function DashboardError() {
  const { t } = useTranslation();

  return (
    <div className="pt-16 text-center">
      <p className="text-muted-foreground text-sm">
        {t("pages.dashboard.error")}
      </p>
    </div>
  );
}

function DashboardContent() {
  const { t } = useTranslation();
  const { user } = useCurrentUser({ suspense: true });

  /* istanbul ignore start @preserve -- Defensive guard: unreachable after Suspense resolves */
  if (!user) throw new Error("Unreachable: user is undefined after Suspense");
  /* istanbul ignore end @preserve */

  const { firstName, lastName, email } = user;

  return (
    <>
      <div className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("pages.dashboard.welcome", { name: firstName })}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {t("pages.dashboard.subtitle")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("pages.dashboard.profile")}</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              <AvatarFallback>
                {firstName.charAt(0)}
                {lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">
                {firstName} {lastName}
              </p>
              <p className="text-muted-foreground text-sm">{email}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

/**
 * Authenticated dashboard view with user data and summary widgets.
 * @returns Centered `<main>` with a suspense boundary around user stats, falling back to a skeleton.
 */
export function DashboardPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 pt-12 pb-16">
      <ErrorBoundary fallback={<DashboardError />}>
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
