import { usePostHog } from "@posthog/react";

/**
 * Hook providing analytics tracking methods.
 * @returns Object with trackEvent method
 * @public
 */
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
