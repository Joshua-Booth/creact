import preview from "@/storybook/preview";

import { Skeleton } from "../skeleton";
import { AspectRatio } from "./aspect-ratio";

/**
 * Displays content within a desired aspect ratio.
 */
const meta = preview.meta({
  title: "ui/AspectRatio",
  component: AspectRatio,
  argTypes: {
    ratio: {
      control: "number",
      description: "The aspect ratio (width / height)",
    },
  },
  args: {
    ratio: 16 / 9,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Displays content within a desired aspect ratio.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/aspect-ratio)",
      },
    },
    layout: "centered",
  },
  render: (args) => (
    <div className="w-[450px]">
      <AspectRatio {...args} className="bg-muted rounded-md">
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
          alt="Gray geometric shapes"
          className="size-full rounded-md object-cover"
        />
      </AspectRatio>
    </div>
  ),
});

// --- Stories ---

/**
 * The default 16:9 aspect ratio, commonly used for video content and hero images.
 */
export const Default = meta.story();

/**
 * A 1:1 square aspect ratio, ideal for profile images or thumbnails.
 */
export const Square = meta.story({
  args: {
    ratio: 1,
  },
  render: (args) => (
    <div className="w-96">
      <AspectRatio {...args} className="bg-muted rounded-md">
        <img
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&dpr=2&q=80"
          alt="Profile avatar"
          className="size-full rounded-md object-cover"
        />
      </AspectRatio>
    </div>
  ),
});

/**
 * A 9:16 portrait aspect ratio, suitable for mobile or vertical content.
 */
export const Portrait = meta.story({
  args: {
    ratio: 9 / 16,
  },
  render: (args) => (
    <div className="w-52">
      <AspectRatio {...args} className="bg-muted rounded-md">
        <img
          src="https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&dpr=2&q=80"
          alt="Burger on wooden board"
          className="size-full rounded-md object-cover"
        />
      </AspectRatio>
    </div>
  ),
});

/**
 * Aspect ratio with a video player placeholder.
 */
export const WithVideo = meta.story({
  render: (args) => (
    <div className="w-[500px]">
      <AspectRatio {...args} className="bg-muted rounded-md">
        <div
          className="flex size-full items-center justify-center rounded-md
            bg-black/90"
        >
          <div className="flex flex-col items-center gap-2 text-white">
            <svg
              className="size-12"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            <span className="text-sm">Click to play</span>
          </div>
        </div>
      </AspectRatio>
    </div>
  ),
});

/**
 * Aspect ratio with a loading skeleton placeholder.
 */
export const WithPlaceholder = meta.story({
  render: (args) => (
    <div className="w-[450px]">
      <AspectRatio {...args} className="rounded-md">
        <Skeleton className="size-full rounded-md" />
      </AspectRatio>
    </div>
  ),
});
