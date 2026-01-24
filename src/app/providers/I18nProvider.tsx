import { Suspense, useEffect, useState } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";

import { i18n } from "@/shared/i18n";

function I18nLoader({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(i18n.isInitialized);

  useEffect(() => {
    if (!i18n.isInitialized) {
      i18n.on("initialized", () => setIsReady(true));
    }
  }, []);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}

function LanguageSync({ children }: { children: React.ReactNode }) {
  const { i18n: i18nInstance } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18nInstance.language;
  }, [i18nInstance.language]);

  return <>{children}</>;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={null}>
        <I18nLoader>
          <LanguageSync>{children}</LanguageSync>
        </I18nLoader>
      </Suspense>
    </I18nextProvider>
  );
}
