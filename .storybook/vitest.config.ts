import path from "node:path";
import { fileURLToPath } from "node:url";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default mergeConfig(
  viteConfig,
  defineConfig({
    plugins: [
      storybookTest({
        configDir: __dirname,
      }),
    ],
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
    },
  })
);
