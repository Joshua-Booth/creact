import { usePostHog } from "posthog-js/react";
import { APP_TITLE } from "../config/app";

export const setPageTitle = (title?: string) => {
  document.title = title ? `${title} | ${APP_TITLE}` : APP_TITLE;
};

export const Event = (category: string, action: string, label: string) => {
  const posthog = usePostHog();
  posthog.capture(action, {
    category,
    label,
  });
};
