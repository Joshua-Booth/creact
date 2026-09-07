import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

// steiger has no --config flag; it discovers this file from the repo root.
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- incomplete types
export default defineConfig([
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- incomplete types
  ...fsd.configs.recommended,
  {
    // `app` is unsliced and its segments are named by the framework (route
    // middleware, React providers); `shared/assets` is the conventional home
    // for static files. The rule has no allow-list, so scope it off here.
    files: ["./src/app/**", "./src/shared/assets/**"],
    rules: {
      "fsd/segments-by-purpose": "off",
    },
  },
]);
