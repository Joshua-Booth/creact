import type { Config } from "@react-router/dev/config";

export default {
  buildDirectory: "dist",
  appDirectory: "src/app",
  ssr: true,
  future: {
    v8_middleware: true,
  },
} satisfies Config;
