import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // All FSD rules are already included in the recommended config
    // You can override specific rules here if needed
    rules: {
      // Example overrides (currently all set to recommended values):
      // 'fsd/public-api': 'off', // Uncomment to disable
    },
  },
]);
