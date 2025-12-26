import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  root: path.resolve(__dirname, ".."),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
  },
  server: {
    port: 8080,
    open: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
