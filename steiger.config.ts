import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- steiger-plugin's types import @steiger/toolkit, which it only lists as a devDependency
  ...fsd.configs.recommended,
  {
    files: ["./src/app/**", "./src/shared/assets/**"],
    rules: {
      "fsd/segments-by-purpose": "off",
    },
  },
]);
