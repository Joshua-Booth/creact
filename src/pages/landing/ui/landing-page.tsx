import { useTranslation } from "react-i18next";

export function LandingPage() {
  const { t } = useTranslation();

  return (
    <main className="container mx-auto mt-12 h-full">
      <title>{t("app.title")}</title>
      <section>
        <h1 className="text-accent-foreground text-center text-3xl font-bold">
          {t("pages.landing.heading")}
        </h1>
        <h2 className="text-muted-foreground text-center">
          {t("pages.landing.subheading")}
        </h2>
      </section>
    </main>
  );
}
