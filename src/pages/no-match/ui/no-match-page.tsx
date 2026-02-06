import { isRouteErrorResponse, useRouteError } from "react-router";
import { useTranslation } from "react-i18next";

export function NoMatchPage() {
  const { t } = useTranslation();
  const error = useRouteError();

  return (
    <main className="mx-2 mb-12 pb-2 text-center max-md:pb-6 max-sm:pb-2">
      <h1 className="pb-1">{t("pages.notFound.heading")}</h1>
      <p>{t("errors.notFoundDescription")}</p>
      {isRouteErrorResponse(error) && (
        <p>
          {error.status}: {error.statusText}
        </p>
      )}
    </main>
  );
}
