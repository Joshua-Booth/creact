import preview from "@/storybook/preview";
import { Info } from "lucide-react";
import { expect, userEvent } from "storybook/test";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";

/**
 * An interactive component which expands/collapses a panel.
 */
const meta = preview.meta({
  title: "ui/Collapsible",
  component: Collapsible,
  argTypes: {},
  args: {
    className: "w-96",
    disabled: false,
  },
  render: (args) => (
    <Collapsible {...args}>
      <CollapsibleTrigger className="flex gap-2">
        <h3 className="font-semibold">Can I use this in my project?</h3>
        <Info className="size-6" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        Yes. Free to use for personal and commercial projects. No attribution
        required.
      </CollapsibleContent>
    </Collapsible>
  ),
  parameters: {
    layout: "centered",
  },
});

// --- Stories ---

/**
 * The default form of the collapsible.
 */
export const Default = meta.story();

/**
 * Use the `disabled` prop to disable the interaction.
 */
export const Disabled = meta.story({
  args: {
    disabled: true,
  },
});

// --- Tests ---

Default.test(
  "when collapsable trigger is clicked, should show content",
  async ({ canvas, step }) => {
    const trigger = await canvas.findByRole("button");

    await step("Open the collapsible", async () => {
      await userEvent.click(trigger, { delay: 100 });
      await expect(canvas.queryByText(/yes/i, { exact: true })).toBeVisible();
    });

    await step("Close the collapsible", async () => {
      await userEvent.click(trigger, { delay: 100 });
      await expect(canvas.queryByText(/yes/i, { exact: true })).toBeNull();
    });
  }
);
