import { createCookie } from "react-router";
import { initReactI18next } from "react-i18next";

import "i18next";

import { createI18nextMiddleware } from "remix-i18next/middleware";

import {
  DEFAULT_LANGUAGE,
  resources,
  SUPPORTED_LANGUAGES,
} from "@/shared/i18n";

// Cookie to store user locale preference
export const localeCookie = createCookie("lng", {
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
});

export const [i18nextMiddleware, getLocale, getInstance] =
  createI18nextMiddleware({
    detection: {
      supportedLanguages: [...SUPPORTED_LANGUAGES],
      fallbackLanguage: DEFAULT_LANGUAGE,
      cookie: localeCookie,
    },
    i18next: {
      resources,
      defaultNS: "common",
    },
    plugins: [initReactI18next],
  });

// Type-safety for the `t` function
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: (typeof resources)["en"];
  }
}
