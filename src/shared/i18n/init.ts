import { initReactI18next } from "react-i18next";

import i18next from "i18next";

import { I18N_CONFIG } from "./config";
import resources from "./locales";
import { DEFAULT_LANGUAGE } from "./types";

/**
 * Loads creact's strings into the global i18next instance, once. Call it
 * before the first render in projects without creact's app layer, which sets
 * up its own instances in `src/app`.
 * @returns The initialised i18next instance
 */
export function initI18n() {
  if (!i18next.isInitialized) {
    void i18next
      .use(initReactI18next)
      .init({ lng: DEFAULT_LANGUAGE, resources, ...I18N_CONFIG });
  }
  return i18next;
}
