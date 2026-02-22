import { createEnv } from "@t3-oss/env-core";
import * as z from "zod";

// Safe reference to process.env — returns {} on the client where `process` is
// not defined, preventing ReferenceError while still allowing t3-env to skip
// server-var validation in the browser (server schemas are excluded from the
// client-side validation shape automatically).
const serverEnv: Record<string, string | undefined> =
  typeof process === "undefined" ? {} : process.env;

// Typed alias avoids `any` from Vite's catch-all `ImportMetaEnv` index signature.
const clientEnv = import.meta.env as Record<string, string | undefined>;

export const env = createEnv({
  clientPrefix: "VITE_",

  server: {
    SESSION_SECRET: z.string().min(1),
    SENTRY_DSN: z.string().min(1).optional(),
  },

  client: {
    VITE_API_ROOT_URL: z.url().optional(),
    VITE_PUBLIC_URL: z.url().optional(),
    VITE_PORT: z.coerce.number().default(8080),
    VITE_SENTRY_DSN: z.string().min(1).optional(),
    VITE_POSTHOG_KEY: z.string().min(1).optional(),
    VITE_POSTHOG_HOST: z.url().optional(),
  },

  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },

  runtimeEnv: {
    SESSION_SECRET: serverEnv.SESSION_SECRET,
    SENTRY_DSN: serverEnv.SENTRY_DSN,
    NODE_ENV: clientEnv.MODE,
    VITE_API_ROOT_URL: clientEnv.VITE_API_ROOT_URL,
    VITE_PUBLIC_URL: clientEnv.VITE_PUBLIC_URL,
    VITE_PORT: clientEnv.VITE_PORT,
    VITE_SENTRY_DSN: clientEnv.VITE_SENTRY_DSN,
    VITE_POSTHOG_KEY: clientEnv.VITE_POSTHOG_KEY,
    VITE_POSTHOG_HOST: clientEnv.VITE_POSTHOG_HOST,
  },

  emptyStringAsUndefined: true,

  skipValidation:
    serverEnv.SKIP_ENV_VALIDATION === "1" ||
    // Vite `define` replacement (used by Storybook / test runners)
    clientEnv.SKIP_ENV_VALIDATION === "1",
});
