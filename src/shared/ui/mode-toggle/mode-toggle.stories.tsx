import { withI18n } from "@/storybook/decorators/with-i18n";
import { withTheme } from "@/storybook/decorators/with-theme";
import preview from "@/storybook/preview";
import { expect, userEvent, within } from "storybook/test";

import { ModeToggle } from "./mode-toggle";

/**
 * Dropdown button that switches between light, dark, and system color themes.
 */
const meta = preview.meta({
  title: "ui/ModeToggle",
  component: ModeToggle,
  decorators: [withI18n, withTheme],
  parameters: {
    docs: {
      description: {
        component:
          "Dropdown button that switches between light, dark, and system color themes.",
      },
    },
  },
});

// --- Stories ---

/**
 * The default toggle button showing the current theme icon.
 */
export const Default = meta.story();

// --- Tests ---

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
