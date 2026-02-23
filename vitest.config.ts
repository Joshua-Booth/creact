import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: ["./config/vitest.config.ts", "./.storybook/vitest.config.ts"],
    coverage: {
      provider: "istanbul",
      reportsDirectory: "coverage/vitest",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.stories.tsx",
        "src/**/*.test.{ts,tsx}",
        "src/**/*.d.ts",
        // Server-only (Node APIs, not executable in browser/jsdom)
        "src/app/entry.server.tsx",
        "src/app/sessions.server.ts",
        // Route entry files (thin wrappers, tested via E2E)
        "src/app/routes/**",
        // Translation resources (static data)
        "src/shared/i18n/locales/**",
        // Framework bootstrap (not unit-testable)
        "src/app/entry.client.tsx",
        // Provider wrappers (thin config, covered transitively)
        "src/app/providers/**",
        // Server middleware (thin config wrapper)
        "src/app/middleware/**",
        // PostHog SDK wrappers (1:1 pass-through, no branching logic)
        "src/shared/lib/analytics/**",
        "src/shared/lib/feature-flags/**",
        // Storybook-only decorator (not runtime code)
        "src/shared/ui/direction/**",
        // Barrel re-export files (no runtime logic)
        "src/**/index.ts",
        // Pure type definitions (no runtime code)
        "src/**/types.ts",
        // Route config (build-time only)
        "src/app/routes.ts",
        // Static asset re-exports
        "src/shared/assets/**",
      ],
      reporter: ["text", "json", "html", "lcov", "clover"],
    },
  },
});
