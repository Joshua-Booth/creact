import { useState } from "react";

import preview from "@/storybook/preview";

import { Slider } from "../slider";
import { Progress, ProgressLabel, ProgressValue } from "./progress";

/**
 * Displays an indicator showing the completion progress of a task, typically
 * displayed as a progress bar.
 */
const meta = preview.meta({
  title: "ui/Progress",
  component: Progress,
  argTypes: {},
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
  render: function ControlledStory(args) {
    const [value, setValue] = useState(50);

    return (
      <div className="flex w-full flex-col gap-4">
        <Progress {...args} value={value} />
        <Slider
          value={value}
          onValueChange={(val) => setValue(val as number)}
          min={0}
          max={100}
          step={1}
        />
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
