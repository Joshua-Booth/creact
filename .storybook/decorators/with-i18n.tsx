import type { Decorator } from "@storybook/react-vite";

import { I18nextProvider, initReactI18next } from "react-i18next";

import i18n from "i18next";

import { I18N_CONFIG, resources } from "@/shared/i18n";

void i18n.use(initReactI18next).init({
  lng: "en",
  resources,
  ...I18N_CONFIG,
});

export const withI18n: Decorator = (Story) => (
  <I18nextProvider i18n={i18n}>
    <Story />
  </I18nextProvider>
);
