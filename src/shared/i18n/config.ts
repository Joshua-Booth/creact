import { initReactI18next } from "react-i18next";

import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "./types";

const loadResources = async (language: string, namespace: string) => {
  const response = await fetch(`/locales/${language}/${namespace}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load ${namespace} for ${language}`);
  }
  return response.json();
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: DEFAULT_LANGUAGE,
    // cspell:disable-next-line
    supportedLngs: [...SUPPORTED_LANGUAGES],
    defaultNS: "common",
    ns: ["common", "validation"],

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: true,
    },

    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
  });

// Load resources dynamically
const loadAllResources = async () => {
  for (const lng of SUPPORTED_LANGUAGES) {
    for (const ns of ["common", "validation"]) {
      try {
        const resources = await loadResources(lng, ns);
        i18n.addResourceBundle(lng, ns, resources, true, true);
      } catch (error) {
        console.error(`Failed to load ${ns} for ${lng}:`, error);
      }
    }
  }
};

loadAllResources();

export { i18n };
