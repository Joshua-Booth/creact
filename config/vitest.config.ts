import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

import { aliases } from "./vite-aliases";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: aliases,
  },
  test: {
    name: "unit",
    root: path.resolve(__dirname, ".."),
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: [path.resolve(__dirname, "../tests/setup.ts")],
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**", "**/*.e2e.*"],
    clearMocks: true,
    restoreMocks: true,
    env: {
      SKIP_ENV_VALIDATION: "1",
    },
  },
});
