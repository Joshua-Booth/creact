import type { Meta, StoryObj } from "@storybook/react-vite";

import * as React from "react";

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

/**
 * Use an array with two values to create a range slider with two thumbs.
 */
export const Range: Story = {
  args: {
    defaultValue: [25, 75],
  },
  render: (args) => (
    <Field className="w-64">
      <FieldLabel>Price Range</FieldLabel>
      <Slider {...args} />
    </Field>
  ),
};

/**
 * Use the `step` prop to specify discrete steps for the slider.
 */
export const WithSteps: Story = {
  args: {
    defaultValue: [50],
    step: 10,
  },
  render: (args) => (
    <Field className="w-64">
      <FieldLabel>Volume (steps of 10)</FieldLabel>
      <Slider {...args} />
    </Field>
  ),
};

/**
 * A controlled slider that displays its current value.
 */
export const WithValue: Story = {
  render: function WithValueStory() {
    const [value, setValue] = React.useState([33]);

    return (
      <Field className="w-64">
        <FieldLabel>Temperature: {value[0]}%</FieldLabel>
        <Slider
          value={value}
          onValueChange={(val) => {
            if (typeof val === "number") {
              setValue([val]);
            } else {
              setValue([...val]);
            }
          }}
          max={100}
          step={1}
        />
      </Field>
    );
  },
};

/**
 * Use `orientation="vertical"` for a vertical slider.
 */
export const Vertical: Story = {
  args: {
    defaultValue: [50],
    orientation: "vertical",
  },
  render: (args) => (
    <Field className="h-40">
      <FieldLabel>Volume</FieldLabel>
      <Slider {...args} />
    </Field>
  ),
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
