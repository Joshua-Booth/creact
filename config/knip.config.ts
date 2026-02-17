import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: [
    // Route entry files (referenced by routes.ts)
    "src/app/routes/*.tsx",
    // Shared public APIs (lib segments have individual entry points)
    "src/shared/assets/index.ts",
    "src/shared/lib/*/index.ts",
    "src/shared/i18n/index.ts",
  ],

  project: ["src/**/*.{ts,tsx}", "tests/**/*.{ts,tsx}"],

  ignore: [
    ".react-router/**",
    ".netlify/**",
    "coverage/**",
    "dist/**",
    // shadcn UI components - available for use across the app
    "src/shared/ui/**",
  ],

  // React Router generated types (created by typegen, may not exist in CI)
  ignoreUnresolved: [/^\.\/\+types\//],

  ignoreDependencies: [
    // CSS-only dependencies (imported in CSS, not JS)
    "tw-animate-css",
    "autoprefixer",
    "@fontsource-variable/inter",
    "@fontsource/inter",
    // Tools without knip plugins
    "@feature-sliced/steiger-plugin",
    "steiger",
    "vite-bundle-analyzer",
    // Presets referenced by name, not as direct plugins
    "conventional-changelog-conventionalcommits",
    // Used via husky pre-commit hook
    "lint-staged",
    // CLI tool for dependency analysis
    "dependency-cruiser",
    // CLI tool for adding components
    "shadcn",
    // Used via --custom-formatter flag in CI
    "@csstools/stylelint-formatter-github",
    // Utility library (kept for future use)
    "es-toolkit",
    // CLI tool for spell checking (run via mise tasks)
    "cspell",
    // Imported in .storybook/preview.tsx (not traced by knip's Storybook plugin)
    "msw-storybook-addon",
    // Coverage tooling (loaded dynamically by vitest)
    "@vitest/coverage-v8",
    "@vitest/coverage-istanbul",
    "monocart-coverage-reports",
  ],

  // System tools (not npm packages)
  ignoreBinaries: ["mise"],

  // Build tools
  vite: {
    config: [
      "config/vite.config.ts",
      "vite.config.ts",
      ".storybook/vite.config.ts",
    ],
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
    config: ["config/eslint.config.ts"],
  },

  prettier: {
    config: ["config/.prettierrc"],
  },

  stylelint: {
    config: ["config/.stylelintrc.json"],
  },

  // Spell checking
  cspell: {
    config: ["config/cspell.json"],
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

  // Scaffolding
  plop: {
    config: ["config/plopfile.ts"],
  },

  // Storybook
  storybook: {
    config: [".storybook/main.ts"],
    entry: [".storybook/preview.ts", "src/**/*.stories.tsx"],
  },

  ignoreExportsUsedInFile: true,
  includeEntryExports: true,
};

export default config;
