import type { Meta, StoryObj } from "@storybook/react-vite";

import * as React from "react";

import Autoplay from "embla-carousel-autoplay";
import { expect, userEvent } from "storybook/test";

import type { CarouselApi } from "./carousel";
import { cn } from "../../lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel";

/**
 * A carousel with motion and swipe built using Embla.
 */
const meta: Meta<typeof Carousel> = {
  title: "ui/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    className: "w-full max-w-xs",
  },
  render: (args) => (
    <Carousel {...args}>
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={`slide-${index + 1}`}>
            <div className="bg-card flex aspect-square items-center justify-center rounded-sm border p-6">
              <span className="text-4xl font-semibold">{index + 1}</span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Carousel>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the carousel.
 */
export const Default: Story = {};

/**
 * Use the `basis` utility class to change the size of the carousel.
 */
export const Size: Story = {
  render: (args) => (
    <Carousel {...args} className="mx-12 w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={`slide-${index + 1}`} className="basis-1/3">
            <div
              className="bg-card flex aspect-square items-center justify-center
                rounded-sm border p-6"
            >
              <span className="text-4xl font-semibold">{index + 1}</span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
  args: {
    className: "mx-12 w-full max-w-xs",
  },
};

export const ShouldNavigate: Story = {
  name: "when clicking next/previous buttons, should navigate through slides",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvas, step }) => {
    const slides = await canvas.findAllByRole("group");
    await expect(slides).toHaveLength(5);
    const nextBtn = await canvas.findByRole("button", { name: /next/i });
    const prevBtn = await canvas.findByRole("button", {
      name: /previous/i,
    });

    await step("navigate to the last slide", async () => {
      for (let i = 0; i < slides.length - 1; i++) {
        await userEvent.click(nextBtn);
      }
    });

    await step("navigate back to the first slide", async () => {
      for (let i = slides.length - 1; i > 0; i--) {
        await userEvent.click(prevBtn);
      }
    });
  },
};

/**
 * Use the `orientation` prop to set the carousel to vertical.
 */
export const Orientation: Story = {
  render: (args) => (
    <Carousel {...args} orientation="vertical" className="w-full max-w-xs">
      <CarouselContent className="-mt-1 h-[200px]">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={`slide-${index + 1}`} className="basis-1/3 pt-1">
            <div
              className="bg-card flex items-center justify-center rounded-sm
                border p-6"
            >
              <span className="text-3xl font-semibold">{index + 1}</span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

/**
 * Use custom margin/padding classes on `CarouselContent` and `CarouselItem` to
 * control the spacing between items.
 */
export const Spacing: Story = {
  render: (args) => (
    <Carousel {...args} className="w-full max-w-sm">
      <CarouselContent className="-ml-2 md:-ml-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem
            key={`slide-${index + 1}`}
            className="basis-1/3 pl-2 md:pl-4"
          >
            <div
              className="bg-card flex aspect-square items-center justify-center
                rounded-sm border p-6"
            >
              <span className="text-2xl font-semibold">{index + 1}</span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
  args: {
    className: "mx-12 w-full max-w-sm",
  },
};

function CarouselWithDots(args: React.ComponentProps<typeof Carousel>) {
  const [api, setApi] = React.useState<CarouselApi>();

  // Use useSyncExternalStore for subscribing to carousel API state
  const current = React.useSyncExternalStore(
    React.useCallback(
      (callback) => {
        api?.on("select", callback);
        return () => api?.off("select", callback);
      },
      [api]
    ),
    () => api?.selectedScrollSnap() ?? 0,
    () => 0
  );

  // Derive count directly from API during render
  const count = api?.scrollSnapList().length ?? 0;

  return (
    <div className="w-full max-w-xs">
      <Carousel {...args} setApi={setApi} className="w-full max-w-xs">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={`slide-${index + 1}`}>
              <div
                className="bg-card flex aspect-square items-center
                  justify-center rounded-sm border p-6"
              >
                <span className="text-4xl font-semibold">{index + 1}</span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="flex justify-center gap-2 py-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            type="button"
            key={`dot-${index + 1}`}
            className={cn(
              "size-2 rounded-full transition-colors",
              index === current ? "bg-primary" : "bg-muted"
            )}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      <div className="text-muted-foreground py-2 text-center text-sm">
        Slide {current + 1} of {count}
      </div>
    </div>
  );
}

/**
 * Use the `setApi` prop to access the carousel API and create dot indicators.
 */
export const API: Story = {
  render: (args) => <CarouselWithDots {...args} />,
};

/**
 * Use the `embla-carousel-autoplay` plugin to create an auto-playing carousel.
 */
export const AutoPlay: Story = {
  render: (args) => (
    <Carousel
      {...args}
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
      className="w-full max-w-xs"
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={`slide-${index + 1}`}>
            <div
              className="bg-card flex aspect-square items-center justify-center
                rounded-sm border p-6"
            >
              <span className="text-4xl font-semibold">{index + 1}</span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

/**
 * Use the `loop` option to create a carousel that wraps around.
 */
export const Loop: Story = {
  render: (args) => (
    <Carousel {...args} opts={{ loop: true }} className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={`slide-${index + 1}`}>
            <div
              className="bg-card flex aspect-square items-center justify-center
                rounded-sm border p-6"
            >
              <span className="text-4xl font-semibold">{index + 1}</span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

function CarouselWithThumbnails(args: React.ComponentProps<typeof Carousel>) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [thumbApi, setThumbApi] = React.useState<CarouselApi>();

  const images = [
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1550831106-0994fe8abcfe?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1579613832125-5d34a13ffe2a?w=800&h=600&fit=crop",
  ];

  // Use useSyncExternalStore for subscribing to carousel API state
  const current = React.useSyncExternalStore(
    React.useCallback(
      (callback) => {
        api?.on("select", callback);
        return () => api?.off("select", callback);
      },
      [api]
    ),
    () => api?.selectedScrollSnap() ?? 0,
    () => 0
  );

  // Sync thumbnail carousel with main carousel selection
  React.useEffect(() => {
    thumbApi?.scrollTo(current);
  }, [current, thumbApi]);

  const handleThumbClick = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <div className="w-full max-w-md">
      <Carousel {...args} setApi={setApi} className="w-full" aria-label="Main">
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={`main-${index + 1}`}>
              <div className="aspect-video overflow-hidden rounded-sm border">
                <img
                  src={src}
                  alt={`Slide ${index + 1}`}
                  className="size-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <Carousel
        setApi={setThumbApi}
        opts={{
          containScroll: "keepSnaps",
          dragFree: true,
        }}
        className="mt-2 w-full"
        aria-label="Thumbnails"
      >
        <CarouselContent className="-ml-2">
          {images.map((src, index) => (
            <CarouselItem
              key={`thumb-${index + 1}`}
              className="basis-1/5 cursor-pointer pl-2"
              onClick={() => handleThumbClick(index)}
            >
              <div
                className={cn(
                  "overflow-hidden rounded-sm border-2 transition-all",
                  index === current
                    ? "border-primary opacity-100"
                    : "border-transparent opacity-50 hover:opacity-75"
                )}
              >
                <img
                  src={src}
                  alt={`Thumbnail ${index + 1}`}
                  className="aspect-video w-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

/**
 * Use the `setApi` prop to sync two carousels and create thumbnail navigation.
 */
export const Thumbnails: Story = {
  render: (args) => <CarouselWithThumbnails {...args} />,
};
