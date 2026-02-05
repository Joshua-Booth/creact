import type { Meta, StoryObj } from "@storybook/react-vite";

import { Bold, Italic, Underline } from "lucide-react";
import { expect, userEvent } from "storybook/test";

import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

/**
 * A set of two-state buttons that can be toggled on or off.
 */
const meta = {
  title: "ui/ToggleGroup",
  component: ToggleGroup,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    variant: "default",
    size: "default",
    disabled: false,
  },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the toggle group.
 */
export const Default: Story = {};

/**
 * Use the `outline` variant to emphasizing the individuality of each button
 * while keeping them visually cohesive.
 */
export const Outline: Story = {
  args: {
    variant: "outline",
  },
};

/**
 * Use the `sm` size for a compact version of the button group, featuring
 * smaller buttons for spaces with limited real estate.
 */
export const Small: Story = {
  args: {
    size: "sm",
  },
};

/**
 * Use the `lg` size for a more prominent version of the button group, featuring
 * larger buttons for emphasis.
 */
export const Large: Story = {
  args: {
    size: "lg",
  },
};

/**
 * Add the `disabled` prop to a button to prevent interactions.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const ShouldToggleItems: Story = {
  name: "when clicking items, should toggle their pressed state",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvas, step }) => {
    const buttons = await canvas.findAllByRole("button");
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- findAllByRole throws if no elements found
    const first = buttons[0]!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- findAllByRole throws if no elements found
    const second = buttons[1]!;

    await step("click first item to press it", async () => {
      await userEvent.click(first);
      await expect(first).toHaveAttribute("aria-pressed", "true");
    });

    await step("click second item, first deselects", async () => {
      await userEvent.click(second);
      await expect(first).toHaveAttribute("aria-pressed", "false");
      await expect(second).toHaveAttribute("aria-pressed", "true");
    });

    await step("click second again to deselect it", async () => {
      await userEvent.click(second);
      await expect(second).toHaveAttribute("aria-pressed", "false");
    });
  },
};

export const ShouldNotToggleWhenDisabled: Story = {
  name: "when group is disabled, should not toggle items",
  tags: ["!dev", "!autodocs"],
  args: {
    disabled: true,
  },
  play: async ({ canvas }) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- findAllByRole throws if no elements found
    const first = (await canvas.findAllByRole("button"))[0]!;
    await expect(first).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(first, { pointerEventsCheck: 0 });
    await expect(first).toHaveAttribute("aria-pressed", "false");
  },
};
