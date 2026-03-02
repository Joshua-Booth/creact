import preview from "@/storybook/preview";
import { ArrowUpRightIcon, BadgeCheck, BookmarkIcon } from "lucide-react";

import { Spinner } from "../spinner";
import { Badge } from "./badge";

/**
 * Displays a badge or a component that looks like a badge.
 */
const meta = preview.meta({
  title: "ui/Badge",
  component: Badge,
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "destructive",
        "outline",
        "ghost",
        "link",
      ],
    },
    children: {
      control: "text",
      description: "Badge content",
    },
  },
  args: {
    variant: "default",
    children: "Badge",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Displays a badge or a component that looks like a badge.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/badge)",
      },
    },
  },
});

// --- Stories ---

/**
 * The default form of the badge.
 */
export const Default = meta.story();

/**
 * Use the `variant` prop to change the style of the badge.
 */
export const Variants = meta.story({
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      <Badge {...args}>Default</Badge>
      <Badge {...args} variant="secondary">
        Secondary
      </Badge>
      <Badge {...args} variant="destructive">
        Destructive
      </Badge>
      <Badge {...args} variant="outline">
        Outline
      </Badge>
      <Badge {...args} variant="ghost">
        Ghost
      </Badge>
    </div>
  ),
});

/**
 * Use `data-icon` to position icons at the start or end of the badge.
 */
export const WithIcon = meta.story({
  name: "With Icon",
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      <Badge {...args} variant="secondary">
        <BadgeCheck data-icon="inline-start" />
        Verified
      </Badge>
      <Badge {...args} variant="outline">
        Bookmark
        <BookmarkIcon data-icon="inline-end" />
      </Badge>
    </div>
  ),
});

/**
 * Use a `Spinner` inside a badge for loading states.
 */
export const WithSpinner = meta.story({
  name: "With Spinner",
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      <Badge {...args} variant="destructive">
        <Spinner data-icon="inline-start" />
        Deleting
      </Badge>
      <Badge {...args} variant="secondary">
        Generating
        <Spinner data-icon="inline-end" />
      </Badge>
    </div>
  ),
});

/**
 * Use the `render` prop to render the badge as a link element.
 */
export const AsLink = meta.story({
  name: "Link",
  render: (args) => (
    <Badge {...args} render={<a href="#link" aria-label="Open Link" />}>
      Open Link <ArrowUpRightIcon data-icon="inline-end" />
    </Badge>
  ),
});

/**
 * Use custom Tailwind classes to create badges with different color schemes.
 */
export const CustomColors = meta.story({
  name: "Custom Colors",
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      <Badge {...args} className="bg-blue-2 text-blue-11">
        Blue
      </Badge>
      <Badge {...args} className="bg-green-2 text-green-11">
        Green
      </Badge>
      <Badge {...args} className="bg-sky-2 text-sky-11">
        Sky
      </Badge>
      <Badge {...args} className="bg-purple-2 text-purple-11">
        Purple
      </Badge>
      <Badge {...args} className="bg-red-2 text-red-11">
        Red
      </Badge>
    </div>
  ),
});
