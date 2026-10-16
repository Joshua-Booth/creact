/** @public */
export const I18N_CONFIG = {
  defaultNS: "common" as const,
  ns: ["common", "components", "validation"] as const,
  interpolation: {
    escapeValue: false,
  },
} as const;
