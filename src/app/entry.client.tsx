import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

import { PostHogProvider } from "@posthog/react";
import * as Sentry from "@sentry/react";
import posthog from "posthog-js";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// Initialize PostHog only if key is available
const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
if (posthogKey) {
  posthog.init(posthogKey, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com",
  });
}

startTransition(() => {
  hydrateRoot(
    document,
    <PostHogProvider client={posthog}>
      <StrictMode>
        <HydratedRouter />
      </StrictMode>
    </PostHogProvider>
  );
});
