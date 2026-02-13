import preview from "@/storybook/preview";

import { Card, CardContent, CardHeader } from "../card";
import { Skeleton } from "./skeleton";

/**
 * Displays a placeholder preview of content before the data gets loaded.
 */
const meta = preview.meta({
  title: "ui/Skeleton",
  component: Skeleton,
  argTypes: {},
  parameters: {
    docs: {
      description: {
        component:
          "Displays a placeholder preview of content before the data gets loaded.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/skeleton)",
      },
    },
    layout: "centered",
  },
});

// --- Stories ---

/**
 * Avatar circle with text lines, commonly used for list items.
 */
export const Default = meta.story({
  render: (args) => (
    <div className="flex items-center gap-4">
      <Skeleton {...args} className="size-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton {...args} className="h-4 w-[250px]" />
        <Skeleton {...args} className="h-4 w-[200px]" />
      </div>
    </div>
  ),
});

/**
 * Circular avatar placeholder with name and description lines.
 */
export const Avatar = meta.story({
  render: (args) => (
    <div className="flex w-fit items-center gap-4">
      <Skeleton {...args} className="size-10 shrink-0 rounded-full" />
      <div className="grid gap-2">
        <Skeleton {...args} className="h-4 w-[150px]" />
        <Skeleton {...args} className="h-4 w-[100px]" />
      </div>
    </div>
  ),
});

/**
 * Card layout with image placeholder and text lines.
 */
export const CardStory = meta.story({
  name: "Card",
  render: (args) => (
    <Card className="w-xs">
      <CardContent>
        <Skeleton {...args} className="aspect-video w-full" />
      </CardContent>
      <CardHeader>
        <Skeleton {...args} className="h-4 w-2/3" />
        <Skeleton {...args} className="h-4 w-1/2" />
      </CardHeader>
    </Card>
  ),
});

/**
 * Multiple lines for paragraph placeholder.
 */
export const Text = meta.story({
  render: (args) => (
    <div className="flex w-xs flex-col gap-2">
      <Skeleton {...args} className="h-4 w-full" />
      <Skeleton {...args} className="h-4 w-full" />
      <Skeleton {...args} className="h-4 w-3/4" />
    </div>
  ),
});

/**
 * Table rows skeleton pattern.
 */
export const Table = meta.story({
  render: (args) => (
    <div className="flex w-sm flex-col gap-2">
      {Array.from({ length: 5 }, (_, i) => `row-${i}`).map((key) => (
        <div key={key} className="flex items-center gap-4">
          <Skeleton {...args} className="h-4 flex-1" />
          <Skeleton {...args} className="h-4 w-24" />
          <Skeleton {...args} className="h-4 w-20" />
        </div>
      ))}
    </div>
  ),
});

/**
 * Form fields skeleton pattern.
 */
export const Form = meta.story({
  render: (args) => (
    <div className="flex w-xs flex-col gap-7">
      <div className="flex flex-col gap-3">
        <Skeleton {...args} className="h-4 w-20" />
        <Skeleton {...args} className="h-8 w-full" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton {...args} className="h-4 w-24" />
        <Skeleton {...args} className="h-8 w-full" />
      </div>
      <Skeleton {...args} className="h-8 w-24" />
    </div>
  ),
});
