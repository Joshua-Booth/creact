import type { Decorator } from "@storybook/react-vite";

import preview from "@/storybook/preview";
import { Theme, ThemeProvider } from "remix-themes";
import { expect, userEvent, within } from "storybook/test";

import { ModeToggle } from "./mode-toggle";

const withTheme: Decorator = (Story) => (
  <ThemeProvider specifiedTheme={Theme.LIGHT} themeAction="/action/set-theme">
    <Story />
  </ThemeProvider>
);

/**
 * Dropdown button that switches between light, dark, and system color themes.
 */
const meta = preview.meta({
  title: "ui/ModeToggle",
  component: ModeToggle,
  decorators: [withTheme],
  parameters: {
    docs: {
      description: {
        component:
          "Dropdown button that switches between light, dark, and system color themes.",
      },
    },
  },
});

/**
 * The default toggle button showing the current theme icon.
 */
export const Default = meta.story();

Default.test(
  "should open dropdown with theme options on click",
  async ({ canvas, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole("button", { name: "Toggle theme" });
    await expect(trigger).toBeVisible();

    await userEvent.click(trigger);

    await expect(
      await body.findByRole("menuitem", { name: "Light" })
    ).toBeInTheDocument();
    await expect(
      await body.findByRole("menuitem", { name: "Dark" })
    ).toBeInTheDocument();
    await expect(
      await body.findByRole("menuitem", { name: "System" })
    ).toBeInTheDocument();
  }
);
