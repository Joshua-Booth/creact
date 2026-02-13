import preview from "@/storybook/preview";

import { cn } from "../../lib/utils";
import { ScrollArea, ScrollBar } from "./scroll-area";

// --- Helpers ---

const SAMPLE_TEXT =
  "Jokester began sneaking into the castle in the middle of the night and leaving jokes all over the place: under the king's pillow, in his soup, even in the royal toilet. The king was furious, but he couldn't seem to stop Jokester. And then, one day, the people of the kingdom discovered that the jokes left by Jokester were so funny that they couldn't help but laugh. And once they started laughing, they couldn't stop. The king was so angry that he banished Jokester from the kingdom, but the people still laughed, and they laughed, and they laughed. And they all lived happily ever after.";

/**
 * Augments native scroll functionality for custom, cross-browser styling.
 */
const meta = preview.meta({
  title: "ui/ScrollArea",
  component: ScrollArea,
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
    docs: {
      description: {
        component:
          "Augments native scroll functionality for custom, cross-browser styling.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/scroll-area)",
      },
    },
    layout: "centered",
  },
});

// --- Stories ---

/**
 * The default form of the scroll area.
 */
export const Default = meta.story();

/**
 * A horizontal scroll area with artwork gallery items.
 */
export const Horizontal = meta.story({
  render: (args) => {
    /* cspell:disable */
    const artworks = [
      { artist: "Ornella Binni", title: "Roman Holiday" },
      { artist: "Tom Byrom", title: "Morning Light" },
      { artist: "Vladimir Malyavko", title: "Silent Forest" },
      { artist: "Giuseppe Mondì", title: "Tuscan Sunset" },
    ];
    /* cspell:enable */

    return (
      <ScrollArea
        {...args}
        className="w-96 rounded-md border whitespace-nowrap"
      >
        <div className="flex w-max space-x-4 p-4">
          {artworks.map((artwork) => (
            <figure key={artwork.artist} className="shrink-0">
              <div
                className="bg-muted aspect-3/4 h-40 overflow-hidden rounded-md"
              />
              <figcaption className="text-muted-foreground pt-2 text-xs">
                Photo by{" "}
                <span className="text-foreground font-semibold">
                  {artwork.artist}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
  },
});

/**
 * Scrollbar appears when hovering over the scroll area.
 */
export const Hover = meta.story({
  args: {
    className: cn(
      "h-32 w-80 rounded-md border p-4",
      "*:data-[slot=scroll-area-scrollbar]:opacity-0",
      "*:data-[slot=scroll-area-scrollbar]:transition-opacity",
      "[&>[data-slot=scroll-area-scrollbar][data-hovering]]:opacity-100"
    ),
  },
});

/**
 * Scrollbar appears only while actively scrolling.
 */
export const Scroll = meta.story({
  args: {
    className: cn(
      "h-32 w-80 rounded-md border p-4",
      "*:data-[slot=scroll-area-scrollbar]:opacity-0",
      "*:data-[slot=scroll-area-scrollbar]:transition-opacity",
      "*:data-[slot=scroll-area-scrollbar]:duration-150",
      "[&>[data-slot=scroll-area-scrollbar][data-scrolling]]:opacity-100",
      "[&>[data-slot=scroll-area-scrollbar][data-scrolling]]:duration-0"
    ),
  },
});
