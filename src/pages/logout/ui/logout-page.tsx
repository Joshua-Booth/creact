import { useTranslation } from "react-i18next";

export function LogoutPage() {
  const { t } = useTranslation();

  return (
    <main className="mx-2 mb-12 pb-2 text-center max-md:pb-6 max-sm:pb-2">
      <h1 className="pb-1">{t("pages.logout.heading")}</h1>
      <p>{t("pages.logout.loggingOut")}</p>
    </main>
  );
}
