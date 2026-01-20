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

// Legacy function export for backwards compatibility
export const Event = (category: string, action: string, label: string) => {
  // Note: This won't work outside of React components
  // Use useAnalytics hook instead
  console.warn(
    "Event() is deprecated. Use useAnalytics() hook inside React components."
  );
};
