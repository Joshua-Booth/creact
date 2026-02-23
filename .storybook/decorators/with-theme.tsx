import type { Decorator } from "@storybook/react-vite";

import { Theme, ThemeProvider } from "remix-themes";

export const withTheme: Decorator = (Story) => (
  <ThemeProvider specifiedTheme={Theme.LIGHT} themeAction="/action/set-theme">
    <Story />
  </ThemeProvider>
);
