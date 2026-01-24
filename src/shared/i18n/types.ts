import "i18next";

import type common from "@/../public/locales/en/common.json";
import type validation from "@/../public/locales/en/validation.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      common: typeof common;
      validation: typeof validation;
    };
  }
}

export type Language = "en";

export const SUPPORTED_LANGUAGES: readonly Language[] = ["en"] as const;
export const DEFAULT_LANGUAGE: Language = "en";
