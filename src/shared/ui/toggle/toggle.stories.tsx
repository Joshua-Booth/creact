import preview from "@/storybook/preview";
import { Bold, Italic } from "lucide-react";
import { expect, userEvent } from "storybook/test";

import { Toggle } from "./toggle";

/**
 * A two-state button that can be either on or off.
 */
const meta = preview.meta({
  title: "ui/Toggle",
  component: Toggle,
  argTypes: {
    children: {
      control: { disable: true },
    },
  },
  args: {
    children: <Bold />,
    "aria-label": "Toggle bold",
  },
  parameters: {
    layout: "centered",
  },
});

// --- Stories ---

/**
 * The default form of the toggle.
 */
export const Default = meta.story();

/**
 * Use the `outline` variant for a distinct outline, emphasizing the boundary
 * of the selection circle for clearer visibility
 */
export const Outline = meta.story({
  args: {
    variant: "outline",
    children: <Italic />,
    "aria-label": "Toggle italic",
  },
});

/**
 * Use the text element to add a label to the toggle.
 */
export const WithText = Outline.extend({
  render: (args) => (
    <Toggle {...args}>
      <Italic />
      Italic
    </Toggle>
  ),
});

/**
 * Use the `sm` size for a smaller toggle, suitable for interfaces needing
 * compact elements without sacrificing usability.
 */
export const Small = meta.story({
  args: {
    size: "sm",
  },
});

/**
 * Use the `lg` size for a larger toggle, offering better visibility and
 * easier interaction for users.
 */
export const Large = meta.story({
  args: {
    size: "lg",
  },
});

/**
 * Add the `disabled` prop to prevent interactions with the toggle.
 */
export const Disabled = meta.story({
  args: {
    disabled: true,
  },
});

// --- Tests ---

Default.test(
  "when clicking the toggle, should toggle pressed state",
  async ({ canvas, step }) => {
    const toggle = await canvas.findByRole("button");

    await step("click to press", async () => {
      await userEvent.click(toggle);
      await expect(toggle).toHaveAttribute("aria-pressed", "true");
    });

    await step("click to deselect", async () => {
      await userEvent.click(toggle);
      await expect(toggle).toHaveAttribute("aria-pressed", "false");
    });
  }
);

Disabled.test(
  "when toggle is disabled, should not toggle pressed state",
  async ({ canvas }) => {
    const toggle = await canvas.findByRole("button");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(toggle, { pointerEventsCheck: 0 });
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
  }
);
