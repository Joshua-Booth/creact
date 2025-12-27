import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: [resolve(__dirname, "../tests/setup.ts")],
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**", "**/*.e2e.*"],
    coverage: {
      provider: "v8",
    },
  },
});
