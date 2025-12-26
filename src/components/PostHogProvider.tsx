import { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const posthogKey = import.meta.env.VITE_POSTHOG_KEY;

  useEffect(() => {
    if (posthogKey) {
      posthog.init(posthogKey, {
        api_host:
          import.meta.env.VITE_POSTHOG_HOST || "https://app.posthog.com",
        loaded: (ph) => {
          console.log("PostHog loaded", ph);
        },
      });
    }
  }, [posthogKey]);

  // If no PostHog key, just render children without the provider
  if (!posthogKey) {
    return <>{children}</>;
  }

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
