import { defineMain } from "@storybook/react-vite/node";

export default defineMain({
  stories: ["../src/**/*.stories.tsx"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@vueless/storybook-dark-mode",
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-mcp",
    "storybook-addon-remix-react-router",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {
      builder: {
        viteConfigPath: ".storybook/vite.config.ts",
      },
    },
  },
  core: {
    disableTelemetry: true,
  },
  features: {
    experimentalTestSyntax: true,
  },
});
