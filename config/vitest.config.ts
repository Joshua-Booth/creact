import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
  },
  test: {
    name: "unit",
    root: path.resolve(__dirname, ".."),
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: [path.resolve(__dirname, "../tests/setup.ts")],
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**", "**/*.e2e.*"],
    coverage: {
      provider: "v8",
    },
  },
});
