import { useState } from "react";

import preview from "@/storybook/preview";
import { expect } from "storybook/test";

import { Field, FieldLabel } from "../field";
import { Slider } from "../slider";
import { Progress, ProgressLabel, ProgressValue } from "./progress";

/**
 * Displays an indicator showing the completion progress of a task, typically
 * displayed as a progress bar.
 */
const meta = preview.meta({
  title: "ui/Progress",
  component: Progress,
  args: {
    "aria-label": "Progress",
    value: 30,
    max: 100,
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/progress) · [Base UI docs](https://base-ui.com/react/components/progress)",
      },
    },
  },
});

// --- Stories ---

/**
 * The default form of the progress.
 */
export const Default = meta.story();

/**
 * When the progress is indeterminate.
 */
export const Indeterminate = meta.story({
  args: {
    value: undefined,
  },
});

/**
 * Use `ProgressLabel` and `ProgressValue` to add a label and value display.
 */
export const Label = meta.story({
  args: {
    value: 56,
  },
  render: (args) => (
    <Progress {...args}>
      <ProgressLabel>Upload progress</ProgressLabel>
      <ProgressValue />
    </Progress>
  ),
});

/**
 * A progress bar that can be controlled by a slider.
 */
export const Controlled = meta.story({
  render: (args) => {
    const [value, setValue] = useState(50);

    return (
      <div className="flex w-full flex-col gap-4">
        <Progress {...args} value={value} />
        <Field>
          <FieldLabel className="sr-only">Progress value</FieldLabel>
          <Slider
            value={value}
            onValueChange={(val) => setValue(val as number)}
            min={0}
            max={100}
            step={1}
          />
        </Field>
      </div>
    );
  },
});

/**
 * When the progress is completed.
 */
export const Completed = meta.story({
  args: {
    value: 100,
  },
});

// --- Tests ---

Default.test(
  "should render progressbar with correct aria values",
  async ({ canvas, step }) => {
    await step("verify progressbar role and aria attributes", async () => {
      const progressbar = canvas.getByRole("progressbar");
      await expect(progressbar).toHaveAttribute("aria-valuenow", "30");
      await expect(progressbar).toHaveAttribute("aria-valuemax", "100");
    });
  }
);
