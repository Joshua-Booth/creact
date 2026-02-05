import type { Meta, StoryObj } from "@storybook/react-vite";

import { Bold, Italic } from "lucide-react";
import { expect, userEvent } from "storybook/test";

import { Toggle } from "./toggle";

/**
 * A two-state button that can be either on or off.
 */
const meta: Meta<typeof Toggle> = {
  title: "ui/Toggle",
  component: Toggle,
  tags: ["autodocs"],
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
};
export default meta;

type Story = StoryObj<typeof Toggle>;

/**
 * The default form of the toggle.
 */
export const Default: Story = {};

/**
 * Use the `outline` variant for a distinct outline, emphasizing the boundary
 * of the selection circle for clearer visibility
 */
export const Outline: Story = {
  args: {
    variant: "outline",
    children: <Italic />,
    "aria-label": "Toggle italic",
  },
};

/**
 * Use the text element to add a label to the toggle.
 */
export const WithText: Story = {
  render: (args) => (
    <Toggle {...args}>
      <Italic />
      Italic
    </Toggle>
  ),
  args: { ...Outline.args },
};

/**
 * Use the `sm` size for a smaller toggle, suitable for interfaces needing
 * compact elements without sacrificing usability.
 */
export const Small: Story = {
  args: {
    size: "sm",
  },
};

/**
 * Use the `lg` size for a larger toggle, offering better visibility and
 * easier interaction for users.
 */
export const Large: Story = {
  args: {
    size: "lg",
  },
};

/**
 * Add the `disabled` prop to prevent interactions with the toggle.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const ShouldToggle: Story = {
  name: "when clicking the toggle, should toggle pressed state",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvas, step }) => {
    const toggle = await canvas.findByRole("button");

    await step("click to press", async () => {
      await userEvent.click(toggle);
      await expect(toggle).toHaveAttribute("aria-pressed", "true");
    });

    await step("click to deselect", async () => {
      await userEvent.click(toggle);
      await expect(toggle).toHaveAttribute("aria-pressed", "false");
    });
  },
};

export const ShouldNotToggleWhenDisabled: Story = {
  name: "when toggle is disabled, should not toggle pressed state",
  tags: ["!dev", "!autodocs"],
  args: {
    disabled: true,
  },
  play: async ({ canvas }) => {
    const toggle = await canvas.findByRole("button");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(toggle, { pointerEventsCheck: 0 });
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
  },
};
