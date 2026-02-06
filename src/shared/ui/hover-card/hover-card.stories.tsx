import preview from "@/storybook/preview";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

/**
 * For sighted users to preview content available behind a link.
 */
const meta = preview.meta({
  title: "ui/HoverCard",
  component: HoverCard,
  argTypes: {},
  args: {},
  render: (args) => (
    <HoverCard {...args}>
      <HoverCardTrigger>Hover</HoverCardTrigger>
      <HoverCardContent>
        The React Framework - created and maintained by @vercel.
      </HoverCardContent>
    </HoverCard>
  ),
  parameters: {
    layout: "centered",
  },
});

// --- Stories ---

/**
 * The default form of the hover card.
 */
export const Default = meta.story();

/**
 * Use the `delay` and `closeDelay` props on the trigger to control timing.
 */
export const Instant = meta.story({
  render: (args) => (
    <HoverCard {...args}>
      <HoverCardTrigger delay={0} closeDelay={0}>
        Hover
      </HoverCardTrigger>
      <HoverCardContent>
        The React Framework - created and maintained by @vercel.
      </HoverCardContent>
    </HoverCard>
  ),
});

// --- Tests ---

Default.test(
  "when hovering over trigger, should show hover card content",
  async ({ canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);
    const getHoverCard = () =>
      canvasElement.ownerDocument.body.querySelector(
        '[data-slot="hover-card-content"]'
      );

    await step("Hover over the trigger element", async () => {
      await userEvent.hover(await canvasBody.findByText(/hover/i));
      await waitFor(async () => {
        const hoverCard = getHoverCard();
        await expect(hoverCard).toBeInTheDocument();
        await expect(hoverCard).toHaveAttribute("data-open");
      });
    });
    await step("Unhover the trigger element", async () => {
      await userEvent.unhover(await canvasBody.findByText(/hover/i));
      await waitFor(async () => {
        const hoverCard = getHoverCard();
        await expect(hoverCard).toHaveAttribute("data-closed");
      });
    });
  }
);
