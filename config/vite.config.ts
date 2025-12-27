import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import devtoolsJson from "vite-plugin-devtools-json";
import { reactRouterDevTools } from "react-router-devtools";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouterDevTools({
      server: {
        silent: true,
      },
    }),
    svgr(),
    reactRouter(),
    tsconfigPaths(),
    devtoolsJson(),
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
    port: Number(process.env.VITE_PORT) || 8080,
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
    noExternal: ["@tailwindcss/vite"],
  },
});
