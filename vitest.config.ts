import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: ["./config/vitest.config.ts", "./.storybook/vitest.config.ts"],
    coverage: {
      provider: "v8",
      reportsDirectory: "coverage/vitest",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.stories.tsx",
        "src/**/*.test.{ts,tsx}",
        "src/**/*.d.ts",
      ],
      reporter: ["text", "json", "html", "lcov", "clover"],
    },
  },
});
