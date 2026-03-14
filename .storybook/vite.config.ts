import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [tailwindcss(), svgr()],
  resolve: {
    tsconfigPaths: true,
  },
  define: {
    // Skip t3-env validation — Storybook has no real env vars.
    "import.meta.env.SKIP_ENV_VALIDATION": JSON.stringify("1"),
    // Polyfill process.env for server modules imported by root.tsx
    // WARNING: This is a placeholder secret for local Storybook only. Never deploy Storybook with real session data.
    "process.env.SESSION_SECRET": JSON.stringify("storybook-secret"),
    "process.env.NODE_ENV": JSON.stringify("development"),
  },
});
