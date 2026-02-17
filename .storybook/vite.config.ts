import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), svgr(), tsconfigPaths()],
  esbuild: {
    legalComments: "inline",
  },
  define: {
    // Polyfill process.env for server modules imported by root.tsx
    "process.env.SESSION_SECRET": JSON.stringify("storybook-secret"),
    "process.env.NODE_ENV": JSON.stringify("development"),
  },
});
