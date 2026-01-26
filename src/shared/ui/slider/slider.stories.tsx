import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, fn, userEvent } from "storybook/test";

import { Field, FieldLabel } from "../field";
import { Slider } from "./slider";

/**
 * An input where the user selects a value from within a given range.
 */
const meta = {
  title: "ui/Slider",
  component: Slider,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    defaultValue: [33],
    max: 100,
    step: 1,
    onValueChange: fn(),
  },
  render: (args) => (
    <Field className="w-64">
      <FieldLabel>Volume</FieldLabel>
      <Slider {...args} />
    </Field>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the slider.
 */
export const Default: Story = {};

/**
 * Use the `disabled` prop to disable the slider.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const ShouldAdjustWithKeyboard: Story = {
  name: "when using keyboard arrows, should adjust slider value",
  tags: ["!dev", "!autodocs"],
  args: {
    defaultValue: [50],
  },
  play: async ({ args, canvas, step }) => {
    const slider = await canvas.findByRole("slider");

    await step("focus the slider", async () => {
      await userEvent.click(slider);
      await expect(slider).toHaveFocus();
    });

    await step("increase value with ArrowRight", async () => {
      await userEvent.keyboard("{ArrowRight}");
      await expect(args.onValueChange).toHaveBeenCalled();
    });

    await step("decrease value with ArrowLeft", async () => {
      await userEvent.keyboard("{ArrowLeft}");
      await expect(args.onValueChange).toHaveBeenCalled();
    });
  },
};
