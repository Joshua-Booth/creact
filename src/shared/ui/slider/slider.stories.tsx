import * as React from "react";

import preview from "@/storybook/preview";
import { expect, fn, userEvent } from "storybook/test";

import { Field, FieldLabel } from "../field";
import { Slider } from "./slider";

/**
 * An input where the user selects a value from within a given range.
 */
const meta = preview.meta({
  title: "ui/Slider",
  component: Slider,
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
    docs: {
      description: {
        component:
          "An input where the user selects a value from within a given range.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/slider)",
      },
    },
    layout: "centered",
  },
});

// --- Stories ---

/**
 * The default form of the slider.
 */
export const Default = meta.story();

/**
 * Use an array with two values to create a range slider with two thumbs.
 */
export const Range = meta.story({
  args: {
    defaultValue: [25, 75],
  },
  render: (args) => (
    <Field className="w-64">
      <FieldLabel>Price Range</FieldLabel>
      <Slider {...args} />
    </Field>
  ),
});

/**
 * Use an array with multiple values for multiple thumbs.
 */
export const MultipleThumbs = meta.story({
  args: {
    defaultValue: [10, 20, 70],
    max: 100,
    step: 10,
  },
  render: (args) => (
    <Field className="w-64">
      <FieldLabel>Multi-range</FieldLabel>
      <Slider {...args} />
    </Field>
  ),
});

/**
 * Use `orientation="vertical"` for a vertical slider.
 */
export const Vertical = meta.story({
  args: {
    defaultValue: [50],
    orientation: "vertical",
  },
  render: (args) => (
    <div className="flex items-center justify-center gap-6">
      <Field className="h-40">
        <FieldLabel>Bass</FieldLabel>
        <Slider {...args} />
      </Field>
      <Field className="h-40">
        <FieldLabel>Treble</FieldLabel>
        <Slider {...args} defaultValue={[25]} />
      </Field>
    </div>
  ),
});

/**
 * A controlled slider that displays its current value.
 */
export const Controlled = meta.story({
  render: function ControlledStory(args) {
    const [value, setValue] = React.useState([0.3, 0.7]);

    return (
      <Field className="w-64">
        <FieldLabel>Temperature: {value.join(", ")}</FieldLabel>
        <Slider
          {...args}
          value={value}
          onValueChange={(val) =>
            setValue(typeof val === "number" ? [val] : [...val])
          }
          min={0}
          max={1}
          step={0.1}
        />
      </Field>
    );
  },
});

/**
 * Use the `disabled` prop to disable the slider.
 */
export const Disabled = meta.story({
  args: {
    disabled: true,
  },
});

// --- Tests ---

Default.test(
  "when using keyboard arrows, should adjust slider value",
  {
    args: {
      defaultValue: [50],
    },
  },
  async ({ args, canvas, step }) => {
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
  }
);

Disabled.test(
  "should not respond to interaction when disabled",
  {},
  async ({ args, canvas, step }) => {
    const slider = await canvas.findByRole("slider");

    await step("attempt to click the disabled slider", async () => {
      await userEvent.click(slider);
      await expect(args.onValueChange).not.toHaveBeenCalled();
    });
  }
);
