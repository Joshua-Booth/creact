import preview from "@/storybook/preview";

import { Separator } from "./separator";

/**
 * Visually or semantically separates content.
 */
const meta = preview.meta({
  title: "ui/Separator",
  component: Separator,
  argTypes: {},
  parameters: {
    docs: {
      description: {
        component:
          "Visually or semantically separates content.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/separator)",
      },
    },
  },
});

// --- Stories ---

/**
 * The default horizontal separator dividing content sections.
 */
export const Default = meta.story({
  render: (args) => (
    <div className="flex max-w-sm flex-col gap-4 text-sm">
      <div className="flex flex-col gap-1.5">
        <div className="leading-none font-medium">shadcn/ui</div>
        <div className="text-muted-foreground">
          The Foundation for your Design System
        </div>
      </div>
      <Separator {...args} />
      <div>
        A set of beautifully designed components that you can customize, extend,
        and build on.
      </div>
    </div>
  ),
});

/**
 * Use `orientation="vertical"` for a vertical separator between horizontal items.
 */
export const Vertical = meta.story({
  render: (args) => (
    <div className="flex h-5 items-center gap-4 text-sm">
      <div>Blog</div>
      <Separator {...args} orientation="vertical" />
      <div>Docs</div>
      <Separator orientation="vertical" />
      <div>Source</div>
    </div>
  ),
});

/**
 * A vertical separator used between menu-style sections with labels and
 * descriptions.
 */
export const Menu = meta.story({
  render: (args) => (
    <div className="flex items-center gap-2 text-sm md:gap-4">
      <div className="flex flex-col gap-1">
        <span className="font-medium">Settings</span>
        <span className="text-muted-foreground text-xs">
          Manage preferences
        </span>
      </div>
      <Separator {...args} orientation="vertical" />
      <div className="flex flex-col gap-1">
        <span className="font-medium">Account</span>
        <span className="text-muted-foreground text-xs">
          Profile &amp; security
        </span>
      </div>
      <Separator {...args} orientation="vertical" className="hidden md:block" />
      <div className="hidden flex-col gap-1 md:flex">
        <span className="font-medium">Help</span>
        <span className="text-muted-foreground text-xs">
          Support &amp; docs
        </span>
      </div>
    </div>
  ),
});

/**
 * Horizontal separators between key-value list items.
 */
export const List = meta.story({
  render: (args) => (
    <div className="flex w-sm flex-col gap-2 text-sm">
      <dl className="flex items-center justify-between">
        <dt>Item 1</dt>
        <dd className="text-muted-foreground">Value 1</dd>
      </dl>
      <Separator {...args} />
      <dl className="flex items-center justify-between">
        <dt>Item 2</dt>
        <dd className="text-muted-foreground">Value 2</dd>
      </dl>
      <Separator {...args} />
      <dl className="flex items-center justify-between">
        <dt>Item 3</dt>
        <dd className="text-muted-foreground">Value 3</dd>
      </dl>
    </div>
  ),
});
