import preview from "@/storybook/preview";
import { ArrowUpIcon, InfoIcon, PhoneIcon } from "lucide-react";

import { Spinner } from "../spinner";
import { Marker, MarkerContent, MarkerIcon } from "./marker";

/**
 * Inline status line for conversations, such as date separators or system
 * events.
 */
const meta = preview.meta({
  title: "ui/Marker",
  component: Marker,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "separator", "border"],
      description: "The visual style of the marker",
    },
  },
  args: {
    variant: "default",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Inline status line for conversations, such as date separators or system events.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/marker)",
      },
    },
  },
});

// --- Stories ---

/**
 * A marker with an icon and content.
 */
export const Default = meta.story({
  render: (args) => (
    <Marker {...args} className="w-80">
      <MarkerIcon>
        <PhoneIcon />
      </MarkerIcon>
      <MarkerContent>Missed call at 9:41 AM</MarkerContent>
    </Marker>
  ),
});

/**
 * The separator variant centers content between horizontal rules, useful for
 * date dividers.
 */
export const Separator = meta.story({
  args: {
    variant: "separator",
  },
  render: (args) => (
    <Marker {...args} className="w-80">
      <MarkerContent>Today</MarkerContent>
    </Marker>
  ),
});

/**
 * The border variant underlines the marker, useful for section breaks.
 */
export const Border = meta.story({
  args: {
    variant: "border",
  },
  render: (args) => (
    <Marker {...args} className="w-80">
      <MarkerIcon>
        <InfoIcon />
      </MarkerIcon>
      <MarkerContent>Alex joined the conversation</MarkerContent>
    </Marker>
  ),
});

/**
 * A streaming or in-progress marker with a spinner; Spinner announces
 * updates via role="status".
 */
export const Status = meta.story({
  render: (args) => (
    <Marker {...args} className="w-80">
      <MarkerIcon>
        <Spinner />
      </MarkerIcon>
      <MarkerContent>Thinking…</MarkerContent>
    </Marker>
  ),
});

/**
 * Apply the shimmer utility for a streaming-text effect.
 */
export const Shimmer = meta.story({
  render: (args) => (
    <Marker {...args} className="w-80">
      <MarkerContent className="shimmer">Generating a reply…</MarkerContent>
    </Marker>
  ),
});

/**
 * Use the render prop to make a marker an interactive link or button.
 */
export const LinksAndButtons = meta.story({
  args: {
    variant: "separator",
  },
  render: (args) => (
    <Marker {...args} className="w-80" render={<button type="button" />}>
      <MarkerIcon>
        <ArrowUpIcon />
      </MarkerIcon>
      <MarkerContent>Load earlier messages</MarkerContent>
    </Marker>
  ),
});
