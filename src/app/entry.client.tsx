import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { I18nextProvider, initReactI18next } from "react-i18next";

import { PostHogProvider } from "@posthog/react";
import * as Sentry from "@sentry/react";
import i18next from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import Fetch from "i18next-fetch-backend";
import posthog from "posthog-js";

import { getAuthToken } from "@/entities/user";
import { configureTokenProvider } from "@/shared/api";
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "@/shared/i18n";

configureTokenProvider(getAuthToken);

const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
if (!sentryDsn && import.meta.env.PROD) {
  console.warn(
    "[Sentry] VITE_SENTRY_DSN is not set. Error tracking is disabled."
  );
}

Sentry.init({
  dsn: sentryDsn,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// Initialize PostHog only if key is available
const posthogKey = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
if (posthogKey !== undefined && posthogKey !== "") {
  posthog.init(posthogKey, {
    api_host:
      (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ??
      "https://us.i.posthog.com",
  });
}

async function main() {
  await i18next
    .use(initReactI18next)
    .use(Fetch)
    .use(I18nextBrowserLanguageDetector)
    .init({
      showSupportNotice: false,
      fallbackLng: DEFAULT_LANGUAGE,
      // cspell:disable-next-line
      supportedLngs: [...SUPPORTED_LANGUAGES],
      defaultNS: "common",
      ns: ["common", "validation"],
      // Detect language from html tag (set by server)
      detection: { order: ["htmlTag"], caches: [] },
      // Load translations from API route
      backend: { loadPath: "/api/locales/{{lng}}/{{ns}}" },
      interpolation: {
        escapeValue: false,
      },
    });

  startTransition(() => {
    hydrateRoot(
      document,
      <I18nextProvider i18n={i18next}>
        <PostHogProvider client={posthog}>
          <StrictMode>
            <HydratedRouter />
          </StrictMode>
        </PostHogProvider>
      </I18nextProvider>
    );
  });
}

main().catch((error) => {
  console.error(error);
  Sentry.captureException(error);
});
