import type { Config } from "@react-router/dev/config";

export default {
  buildDirectory: process.env.E2E === "true" ? "dist-e2e" : "dist",
  appDirectory: "src/app",
  ssr: true,
} satisfies Config;
