import type { Meta, StoryObj } from "@storybook/react-vite";

import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";

import { cn } from "../../lib/utils";
import { ScrollArea } from "./scroll-area";

const SAMPLE_TEXT =
  "Jokester began sneaking into the castle in the middle of the night and leaving jokes all over the place: under the king's pillow, in his soup, even in the royal toilet. The king was furious, but he couldn't seem to stop Jokester. And then, one day, the people of the kingdom discovered that the jokes left by Jokester were so funny that they couldn't help but laugh. And once they started laughing, they couldn't stop. The king was so angry that he banished Jokester from the kingdom, but the people still laughed, and they laughed, and they laughed. And they all lived happily ever after.";

/**
 * Augments native scroll functionality for custom, cross-browser styling.
 */
const meta = {
  title: "ui/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
    },
  },
  args: {
    className: "h-32 w-80 rounded-md border p-4",
    children: SAMPLE_TEXT,
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the scroll area.
 */
export const Default: Story = {};

/**
 * Scrollbar is always visible regardless of scroll state or hover.
 */
export const Always: Story = {
  render: (args) => (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", args.className)}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
      >
        {args.children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar
        data-slot="scroll-area-scrollbar"
        orientation="vertical"
        className="flex h-full w-2.5 touch-none border-l border-l-transparent p-px transition-colors select-none"
      >
        <ScrollAreaPrimitive.Thumb
          data-slot="scroll-area-thumb"
          className="bg-border relative flex-1 rounded-full"
        />
      </ScrollAreaPrimitive.Scrollbar>
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  ),
};

/**
 * Scrollbar appears when hovering over the scroll area.
 */
export const Hover: Story = {
  render: (args) => (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", args.className)}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
      >
        {args.children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar
        data-slot="scroll-area-scrollbar"
        orientation="vertical"
        className="flex h-full w-2.5 touch-none border-l border-l-transparent p-px opacity-0 transition-opacity select-none data-[hovering]:opacity-100"
      >
        <ScrollAreaPrimitive.Thumb
          data-slot="scroll-area-thumb"
          className="bg-border relative flex-1 rounded-full"
        />
      </ScrollAreaPrimitive.Scrollbar>
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  ),
};

/**
 * Scrollbar appears only while actively scrolling.
 */
export const Scroll: Story = {
  render: (args) => (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", args.className)}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
      >
        {args.children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar
        data-slot="scroll-area-scrollbar"
        orientation="vertical"
        className="flex h-full w-2.5 touch-none border-l border-l-transparent p-px opacity-0 transition-opacity duration-150 select-none data-[scrolling]:opacity-100 data-[scrolling]:duration-0"
      >
        <ScrollAreaPrimitive.Thumb
          data-slot="scroll-area-thumb"
          className="bg-border relative flex-1 rounded-full"
        />
      </ScrollAreaPrimitive.Scrollbar>
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  ),
};
