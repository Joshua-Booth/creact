import path from "path";

import { defineConfig, devices } from "@playwright/test";

const rootDir = path.resolve(import.meta.dirname, "..");

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- fallback to default port when env var is unset
const port = Number(process.env.VITE_PORT) || 8080;
const collectCoverage = process.env.COVERAGE === "true";

/** Patterns excluded from coverage metrics (aligned with vitest.config.ts) */
// eslint-disable-next-line security/detect-non-literal-regexp -- Pattern list is static, not user-supplied
const EXCLUDED = new RegExp(
  [
    "\\.stories\\.",
    "\\.test\\.",
    "\\.d\\.ts$",
    "src/app/entry\\.server\\.tsx$",
    "src/app/sessions\\.server\\.ts$",
    "src/app/entry\\.client\\.tsx$",
    "src/app/providers/",
    "src/app/middleware/",
    "src/app/routes/",
    "src/shared/i18n/locales/",
    "src/shared/lib/analytics/",
    "src/shared/lib/feature-flags/",
    "src/shared/ui/direction/",
    "/index\\.ts$",
    "/types\\.ts$",
    "src/app/routes\\.ts$",
    "src/shared/assets/",
  ].join("|")
);

const coverageReporter = collectCoverage
  ? [
      [
        "monocart-reporter",
        {
          name: "E2E Coverage",
          outputFile: path.join(rootDir, "coverage/e2e/index.html"),
          coverage: {
            reports: ["raw", "v8", "console-summary"],
            outputDir: path.join(rootDir, "coverage/e2e"),
            entryFilter: (entry: { url: string }) =>
              entry.url.includes("/assets/"),
            sourceFilter: (sourcePath: string) =>
              sourcePath.includes("/src/") &&
              !sourcePath.includes("node_modules") &&
              !EXCLUDED.test(sourcePath),
          },
        },
      ] as const,
    ]
  : [];

export default defineConfig({
  testDir: "../tests/e2e",
  outputDir: "../test-results",
  use: {
    baseURL: `http://localhost:${port}`,
    headless: true,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ...(process.env.CI ? [["github"] as const] : []),
    ["html", { outputFolder: "../playwright-report" }],
    ...coverageReporter,
  ],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `vite preview --config config/vite.config.ts --port ${port}`,
    cwd: "..",
    port,
    reuseExistingServer: true,
  },
});
