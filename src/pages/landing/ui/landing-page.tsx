import { useTranslation } from "react-i18next";

/**
 * Public landing page introducing the application.
 * @returns Vertically centered heading and subheading with marketing copy.
 */
export function LandingPage() {
  const { t } = useTranslation();

  return (
    <main
      className="container mx-auto flex min-h-[calc(100dvh-4rem)] items-start
        justify-center px-4 pt-[20vh]"
    >
      <section
        className="flex flex-col items-center gap-4 text-center text-pretty"
      >
        <h1 className="text-accent-foreground text-4xl font-bold">
          {t("pages.landing.heading")}
        </h1>
        <h2 className="text-muted-foreground text-lg">
          {t("pages.landing.subheading")}
        </h2>
      </section>
    </main>
  );
}
