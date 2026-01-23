import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.VITE_PORT) || 8080;

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
  reporter: process.env.CI
    ? [["github"], ["html", { outputFolder: "../playwright-report" }]]
    : [["html", { outputFolder: "../playwright-report" }]],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "mise run dev",
    port,
    reuseExistingServer: true,
  },
});
