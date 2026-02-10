import path from "path";

import netlifyPlugin from "@netlify/vite-plugin-react-router";
import { reactRouter } from "@react-router/dev/vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { reactRouterDevTools } from "react-router-devtools";
import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";
import istanbul from "vite-plugin-istanbul";
import reactScan from "vite-plugin-react-scan";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

const enableCoverage = process.env.COVERAGE === "true";
const isE2E = process.env.E2E === "true";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactScan(),
    reactRouterDevTools({
      server: {
        silent: true,
      },
    }),
    svgr(),
    reactRouter(),
    ...(isE2E ? [] : [netlifyPlugin()]),
    tsconfigPaths(),
    devtoolsJson(),
    ...(enableCoverage
      ? [
          istanbul({
            include: "src/*",
            exclude: ["node_modules", "**/*.test.*", "**/*.stories.*"],
            extension: [".ts", ".tsx"],
            forceBuildInstrument: true,
          }),
        ]
      : []),
    sentryVitePlugin({
      telemetry: false,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        filesToDeleteAfterUpload: ["./dist/**/*.map"],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
  },
  optimizeDeps: {
    exclude: ["fsevents"],
  },
  server: {
    port: Number.isNaN(Number(process.env.VITE_PORT))
      ? 8080
      : Number(process.env.VITE_PORT),
    open: true,
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
  },

  css: {
    postcss: {},
  },

  ssr: {
    noExternal: ["@tailwindcss/vite", "posthog-js", "@posthog/react"],
  },
});
