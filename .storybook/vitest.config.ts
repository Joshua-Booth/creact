import path from "node:path";
import { fileURLToPath } from "node:url";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Patterns for expected error boundary console.error output that should not appear in test output. */
const EXPECTED_ERROR_PATTERNS = [
  "simulated error for demonstration purposes",
  "The above error occurred",
  "React will try to recreate",
  "401 Unauthorized",
  "suspended inside an `act` scope",
];

function isExpectedError(msg: string): boolean {
  return EXPECTED_ERROR_PATTERNS.some((pattern) => msg.includes(pattern));
}

export default mergeConfig(
  viteConfig,
  defineConfig({
    optimizeDeps: {
      include: ["react/jsx-runtime"],
    },
    test: {
      name: "storybook",
      root: path.resolve(__dirname, ".."),
      setupFiles: [path.join(__dirname, "vitest.setup.ts")],
      browser: {
        enabled: true,
        headless: true,
        provider: playwright({}),
        instances: [{ browser: "chromium" }],
      },
      // Filter expected error boundary console output from vitest's reporter
      onConsoleLog(log: string) {
        if (isExpectedError(log)) return false;
      },
    },
    plugins: [
      storybookTest({
        configDir: __dirname,
      }),
      // Filter expected error boundary console.error forwarded from browser via Vite HMR
      {
        name: "filter-expected-errors",
        configureServer(server) {
          for (const env of Object.values(server.environments)) {
            const origError = env.logger.error.bind(env.logger);
            env.logger.error = (msg, options) => {
              if (typeof msg === "string" && isExpectedError(msg)) return;
              origError(msg, options);
            };
          }
        },
      },
    ],
  })
);
