import { usePostHog } from "posthog-js/react";

export const Event = (category: string, action: string, label: string) => {
  const posthog = usePostHog();
  posthog.capture(action, {
    category,
    label,
  });
};
