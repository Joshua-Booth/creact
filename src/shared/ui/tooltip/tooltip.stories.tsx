import preview from "@/storybook/preview";
import { SaveIcon } from "lucide-react";
import { expect, userEvent, waitFor } from "storybook/test";

import { Button } from "../button";
import { Kbd } from "../kbd";
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
    docs: {
      description: {
        component:
          "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/tooltip)",
      },
    },
    layout: "centered",
  },
  render: (args) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>
          Hover
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
 * Use the `side` prop to display the tooltip on different sides of the trigger.
 */
export const Sides = meta.story({
  render: (args) => (
    <div className="flex items-center gap-4">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <TooltipProvider key={side}>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" />}>
              {side.charAt(0).toUpperCase() + side.slice(1)}
            </TooltipTrigger>
            <TooltipContent {...args} side={side}>
              {side.charAt(0).toUpperCase() + side.slice(1)}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  ),
});

/**
 * Display a keyboard shortcut alongside the tooltip text.
 */
export const Keyboard = meta.story({
  render: (args) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={<Button variant="outline" size="icon-sm" aria-label="Save" />}
        >
          <SaveIcon />
        </TooltipTrigger>
        <TooltipContent {...args} className="pr-1.5">
          <div className="flex items-center gap-2">
            Save Changes <Kbd>S</Kbd>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
});

/**
 * Wrap a disabled button in a span trigger so the tooltip still appears.
 */
export const DisabledButton = meta.story({
  name: "Disabled",
  render: (args) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<span className="inline-block w-fit" />}>
          <Button variant="outline" disabled>
            Disabled
          </Button>
        </TooltipTrigger>
        <TooltipContent {...args}>
          <p>This feature is currently unavailable</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
});

// --- Tests ---

function getTooltip(canvasElement: HTMLElement) {
  return canvasElement.ownerDocument.body.querySelector(
    '[data-slot="tooltip-content"]'
  );
}

Default.test(
  "when hovering over trigger, should show tooltip content",
  async ({ canvas, canvasElement, step }) => {
    const triggerBtn = canvas.getByRole("button", { name: /hover/i });

    await step("hover over trigger", async () => {
      await userEvent.hover(triggerBtn);
      await waitFor(async () => {
        const tooltip = getTooltip(canvasElement);
        await expect(tooltip).toBeInTheDocument();
        await expect(tooltip).toHaveAttribute("data-open");
      });
    });

    await step("unhover trigger", async () => {
      await userEvent.unhover(triggerBtn);
      await waitFor(async () => {
        const tooltip = getTooltip(canvasElement);
        await expect(tooltip).toHaveAttribute("data-closed");
      });
    });
  }
);

Default.test(
  "when focusing trigger with keyboard, should show tooltip content",
  async ({ canvas, canvasElement, step }) => {
    const triggerBtn = canvas.getByRole("button", { name: /hover/i });

    await step("focus trigger via Tab", async () => {
      await userEvent.tab();
      await waitFor(() => expect(triggerBtn).toHaveFocus());
      await waitFor(async () => {
        const tooltip = getTooltip(canvasElement);
        await expect(tooltip).toBeInTheDocument();
        await expect(tooltip).toHaveAttribute("data-open");
      });
    });

    await step("blur trigger via Tab", async () => {
      await userEvent.tab();
      await waitFor(async () => {
        const tooltip = getTooltip(canvasElement);
        await expect(tooltip).toHaveAttribute("data-closed");
      });
    });
  }
);
