import { reactRouterDevTools } from "react-router-devtools";
import netlifyPlugin from "@netlify/vite-plugin-react-router";
import { reactRouter } from "@react-router/dev/vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

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
    netlifyPlugin(),
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
