import preview from "@/storybook/preview";
import { expect } from "storybook/test";

import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from "./bubble";

/**
 * Chat message bubble with color variants for sent, received, and status
 * styles.
 */
const meta = preview.meta({
  title: "ui/Bubble",
  component: Bubble,
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "muted",
        "tinted",
        "outline",
        "ghost",
        "destructive",
      ],
      description: "The visual style of the bubble",
    },
    align: {
      control: "select",
      options: ["start", "end"],
      description: "Which side of the conversation the bubble aligns to",
    },
  },
  args: {
    variant: "default",
    align: "start",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Chat message bubble with color variants for sent, received, and status styles.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/bubble)",
      },
    },
  },
});

// --- Stories ---

/**
 * A single bubble with content.
 */
export const Default = meta.story({
  render: (args) => (
    <Bubble {...args}>
      <BubbleContent>Hey! Are we still on for lunch tomorrow?</BubbleContent>
    </Bubble>
  ),
});

/**
 * All available bubble variants.
 */
export const Variants = meta.story({
  render: (args) => (
    <BubbleGroup className="w-80">
      <Bubble {...args} variant="default">
        <BubbleContent>Default</BubbleContent>
      </Bubble>
      <Bubble {...args} variant="secondary">
        <BubbleContent>Secondary</BubbleContent>
      </Bubble>
      <Bubble {...args} variant="muted">
        <BubbleContent>Muted</BubbleContent>
      </Bubble>
      <Bubble {...args} variant="tinted">
        <BubbleContent>Tinted</BubbleContent>
      </Bubble>
      <Bubble {...args} variant="outline">
        <BubbleContent>Outline</BubbleContent>
      </Bubble>
      <Bubble {...args} variant="ghost">
        <BubbleContent>Ghost</BubbleContent>
      </Bubble>
      <Bubble {...args} variant="destructive">
        <BubbleContent>Destructive</BubbleContent>
      </Bubble>
    </BubbleGroup>
  ),
});

/**
 * A conversation with bubbles aligned to both sides.
 */
export const Conversation = meta.story({
  render: (args) => (
    <BubbleGroup className="w-80">
      <Bubble {...args} variant="muted">
        <BubbleContent>Are we still on for lunch tomorrow?</BubbleContent>
      </Bubble>
      <Bubble {...args} variant="default" align="end">
        <BubbleContent>Absolutely, see you at noon!</BubbleContent>
      </Bubble>
    </BubbleGroup>
  ),
});

/**
 * Use BubbleReactions to pin emoji reactions to a bubble.
 */
export const Reactions = meta.story({
  args: {
    variant: "muted",
  },
  render: (args) => (
    <Bubble {...args} className="mb-4">
      <BubbleContent>We shipped the new release! 🎉</BubbleContent>
      <BubbleReactions>👍 🎉</BubbleReactions>
    </Bubble>
  ),
});

/**
 * Use the render prop on BubbleContent to make a bubble a link or button.
 */
export const LinksAndButtons = meta.story({
  args: {
    variant: "muted",
  },
  render: (args) => (
    <BubbleGroup className="w-80">
      <Bubble {...args}>
        <BubbleContent
          render={
            <a href="https://ui.shadcn.com" target="_blank" rel="noreferrer">
              Check out the new component docs →
            </a>
          }
        />
      </Bubble>
      <Bubble {...args}>
        <BubbleContent render={<button type="button" />}>
          Tap to retry sending this message
        </BubbleContent>
      </Bubble>
    </BubbleGroup>
  ),
});

LinksAndButtons.test(
  "should render interactive bubble content",
  async ({ canvas }) => {
    await expect(
      canvas.getByRole("link", { name: "Check out the new component docs →" })
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "Tap to retry sending this message" })
    ).toBeInTheDocument();
  }
);
