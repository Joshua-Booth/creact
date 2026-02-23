import { defineMain } from "@storybook/react-vite/node";
import remarkGfm from "remark-gfm";

export default defineMain({
  stories: ["../src/**/*.mdx", "../src/**/*.stories.tsx"],
  addons: [
    {
      name: "@storybook/addon-docs",
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    "@storybook/addon-a11y",
    "@vueless/storybook-dark-mode",
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-mcp",
    "storybook-addon-remix-react-router",
    "@storybook/addon-designs",
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
    experimentalComponentsManifest: true,
  },
});
