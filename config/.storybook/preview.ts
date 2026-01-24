import type { Preview } from "@storybook/react-vite";

import "../../src/app/styles/main.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
  },
  tags: ["autodocs"],
};

export default preview;
