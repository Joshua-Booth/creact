import preview from "@/storybook/preview";

import { Skeleton } from "./skeleton";

/**
 * Displays a placeholder preview of content before the data gets loaded.
 * @see https://ui.shadcn.com/docs/components/skeleton
 */
const meta = preview.meta({
  title: "ui/Skeleton",
  component: Skeleton,
  argTypes: {},
  parameters: {
    layout: "centered",
  },
});

// --- Stories ---

/**
 * Avatar circle with text lines, commonly used for list items.
 */
export const Default = meta.story({
  render: (args) => (
    <div className="flex items-center space-x-4">
      <Skeleton {...args} className="size-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton {...args} className="h-4 w-64" />
        <Skeleton {...args} className="h-4 w-52" />
      </div>
    </div>
  ),
});

/**
 * Card layout with image placeholder and text lines.
 */
export const Card = meta.story({
  render: (args) => (
    <div className="flex flex-col space-y-3">
      <Skeleton {...args} className="h-32 w-64 rounded-xl" />
      <div className="space-y-2">
        <Skeleton {...args} className="h-4 w-64" />
        <Skeleton {...args} className="h-4 w-52" />
      </div>
    </div>
  ),
});

/**
 * Multiple lines for paragraph placeholder.
 */
export const Text = meta.story({
  render: (args) => (
    <div className="w-80 space-y-2">
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
    <div className="w-[500px] space-y-3">
      {/* Header row */}
      <div className="flex gap-4 border-b pb-3">
        <Skeleton {...args} className="h-4 w-24" />
        <Skeleton {...args} className="h-4 w-32" />
        <Skeleton {...args} className="h-4 flex-1" />
        <Skeleton {...args} className="h-4 w-20" />
      </div>
      {/* Data rows */}
      {[1, 2, 3].map((row) => (
        <div key={row} className="flex items-center gap-4">
          <Skeleton {...args} className="h-4 w-24" />
          <Skeleton {...args} className="h-4 w-32" />
          <Skeleton {...args} className="h-4 flex-1" />
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
    <div className="w-80 space-y-6">
      <div className="space-y-2">
        <Skeleton {...args} className="h-4 w-20" />
        <Skeleton {...args} className="h-10 w-full rounded-md" />
      </div>
      <div className="space-y-2">
        <Skeleton {...args} className="h-4 w-24" />
        <Skeleton {...args} className="h-10 w-full rounded-md" />
      </div>
      <div className="space-y-2">
        <Skeleton {...args} className="h-4 w-16" />
        <Skeleton {...args} className="h-24 w-full rounded-md" />
      </div>
      <Skeleton {...args} className="h-10 w-full rounded-md" />
    </div>
  ),
});
