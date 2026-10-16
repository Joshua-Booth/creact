import type { Decorator } from "@storybook/react-vite";

import { I18nextProvider } from "react-i18next";

import { initI18n } from "@/shared/i18n";

const i18n = initI18n();

export const withI18n: Decorator = (Story) => (
  <I18nextProvider i18n={i18n}>
    <Story />
  </I18nextProvider>
);
