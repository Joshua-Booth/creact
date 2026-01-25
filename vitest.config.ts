import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: ["./config/vitest.config.ts", "./.storybook/vitest.config.ts"],
  },
});
