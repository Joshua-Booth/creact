import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: [
    // Page components (referenced by routes.ts)
    "src/pages/**/ui/index.tsx",
  ],

  project: ["src/**/*.{ts,tsx}", "tests/**/*.ts"],

  ignore: [
    ".react-router/**",
    "dist/**",
    // FSD shared layer - utilities available for future use
    "src/shared/**",
    // FSD page barrel exports (routes.ts imports ./ui directly)
    "src/pages/*/index.ts",
  ],

  ignoreDependencies: [
    // CSS-only dependencies (imported in CSS, not JS)
    "tailwindcss",
    "tw-animate-css",
    "autoprefixer",
    "@fontsource-variable/inter",
    "@fontsource/inter",
    // shadcn/ui component dependencies (available for future use)
    "@base-ui/react",
    "algoliasearch",
    "axios",
    "class-variance-authority",
    "cmdk",
    "date-fns",
    "embla-carousel-react",
    "input-otp",
    "next-themes",
    "react-day-picker",
    "react-hook-form",
    "react-resizable-panels",
    "recharts",
    "shadcn",
    "sonner",
    "vaul",
    // Tools without knip plugins
    "@feature-sliced/steiger-plugin",
    "@testing-library/user-event",
    "steiger",
    "vite-bundle-analyzer",
    // CLI binaries (not imported in config files)
    "@commitlint/cli",
    // Presets referenced by name, not as direct plugins
    "conventional-changelog-conventionalcommits",
  ],

  // Build tools
  vite: {
    config: ["config/vite.config.ts", "vite.config.ts"],
  },

  // Testing
  vitest: {
    config: ["config/vitest.config.ts"],
    entry: ["tests/setup.ts", "src/**/*.test.{ts,tsx}"],
  },

  playwright: {
    config: ["config/playwright.config.ts"],
    entry: ["tests/e2e/**/*.spec.ts"],
  },

  // Linting & formatting
  eslint: {
    config: ["config/eslint.config.js"],
  },

  prettier: {
    config: ["config/.prettierrc"],
  },

  stylelint: {
    config: ["config/.stylelintrc.json"],
  },

  // Git hooks & commits
  commitlint: {
    config: ["config/commitlint.config.ts"],
  },

  "lint-staged": {
    config: ["config/.lintstagedrc"],
  },

  // Release
  "semantic-release": {
    config: ["config/.releaserc.json"],
  },

  // TypeScript
  typescript: {
    config: ["config/tsconfig.json"],
  },

  ignoreExportsUsedInFile: true,
  includeEntryExports: true,
};

export default config;
