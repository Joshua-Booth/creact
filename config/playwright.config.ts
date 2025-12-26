import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.VITE_PORT) || 8080;

export default defineConfig({
  testDir: "../tests/e2e",
  use: {
    baseURL: `http://localhost:${port}`,
    headless: true,
  },
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
