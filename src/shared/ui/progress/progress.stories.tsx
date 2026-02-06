import preview from "@/storybook/preview";

import { Progress } from "./progress";

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
 * When the progress is completed.
 */
export const Completed = meta.story({
  args: {
    value: 100,
  },
});
