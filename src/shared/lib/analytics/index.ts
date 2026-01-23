import { usePostHog } from "@posthog/react";

export const useAnalytics = () => {
  const posthog = usePostHog();

  const trackEvent = (category: string, action: string, label: string) => {
    posthog?.capture(action, {
      category,
      label,
    });
  };

  return { trackEvent };
};
