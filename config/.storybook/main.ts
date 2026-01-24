import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    "../../src/{shared,entities,features,widgets,pages}/**/*.mdx",
    "../../src/{shared,entities,features,widgets,pages}/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@chromatic-com/storybook",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {
      builder: {
        viteConfigPath: "config/.storybook/vite.config.ts",
      },
    },
  },
  core: {
    disableTelemetry: true,
  },
};

export default config;
