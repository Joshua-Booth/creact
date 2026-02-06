import preview from "@/storybook/preview";
import { Plus } from "lucide-react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

/**
 * A popup that displays information related to an element when the element
 * receives keyboard focus or the mouse hovers over it.
 */
const meta = preview.meta({
  title: "ui/Tooltip",
  component: TooltipContent,
  argTypes: {
    side: {
      options: ["top", "bottom", "left", "right"],
      control: {
        type: "radio",
      },
    },
    children: {
      control: "text",
    },
  },
  args: {
    side: "top",
    children: "Add to library",
  },
  parameters: {
    layout: "centered",
  },
  render: (args) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Plus className="size-4" />
          <span className="sr-only">Add</span>
        </TooltipTrigger>
        <TooltipContent {...args} />
      </Tooltip>
    </TooltipProvider>
  ),
});

// --- Stories ---

/**
 * The default form of the tooltip.
 */
export const Default = meta.story();

/**
 * Use the `bottom` side to display the tooltip below the element.
 */
export const Bottom = meta.story({
  args: {
    side: "bottom",
  },
});

/**
 * Use the `left` side to display the tooltip to the left of the element.
 */
export const Left = meta.story({
  args: {
    side: "left",
  },
});

/**
 * Use the `right` side to display the tooltip to the right of the element.
 */
export const Right = meta.story({
  args: {
    side: "right",
  },
});

// --- Tests ---

Default.test(
  "when hovering over trigger, should show hover tooltip content",
  async ({ canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);
    const triggerBtn = await canvasBody.findByRole("button", { name: /add/i });
    const getTooltip = () =>
      canvasElement.ownerDocument.body.querySelector(
        '[data-slot="tooltip-content"]'
      );

    await step("hover over trigger", async () => {
      await userEvent.hover(triggerBtn);
      await waitFor(async () => {
        const tooltip = getTooltip();
        await expect(tooltip).toBeInTheDocument();
        await expect(tooltip).toHaveAttribute("data-open");
      });
    });

    await step("unhover trigger", async () => {
      await userEvent.unhover(triggerBtn);
      await waitFor(async () => {
        const tooltip = getTooltip();
        await expect(tooltip).toHaveAttribute("data-closed");
      });
    });
  }
);
