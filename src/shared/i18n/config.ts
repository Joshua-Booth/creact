// i18n configuration constants
// The actual i18n instance is managed by remix-i18next middleware (server)
// and entry.client.tsx (client)

/** @public */
export const I18N_CONFIG = {
  defaultNS: "common" as const,
  ns: ["common", "validation"] as const,
  interpolation: {
    escapeValue: false,
  },
} as const;
