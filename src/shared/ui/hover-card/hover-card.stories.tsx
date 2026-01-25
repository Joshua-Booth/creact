import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, userEvent, waitFor, within } from "storybook/test";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

/**
 * For sighted users to preview content available behind a link.
 */
const meta = {
  title: "ui/HoverCard",
  component: HoverCard,
  tags: ["autodocs"],
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
} satisfies Meta<typeof HoverCard>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the hover card.
 */
export const Default: Story = {};

/**
 * Use the `delay` and `closeDelay` props on the trigger to control timing.
 */
export const Instant: Story = {
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
};

export const ShouldShowOnHover: Story = {
  name: "when hovering over trigger, should show hover card content",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);
    const getHoverCard = () =>
      canvasElement.ownerDocument.body.querySelector(
        '[data-slot="hover-card-content"]'
      );

    await step("Hover over the trigger element", async () => {
      await userEvent.hover(await canvasBody.findByText(/hover/i));
      await waitFor(() => {
        const hoverCard = getHoverCard();
        expect(hoverCard).toBeInTheDocument();
        expect(hoverCard).toHaveAttribute("data-open");
      });
    });
    await step("Unhover the trigger element", async () => {
      await userEvent.unhover(await canvasBody.findByText(/hover/i));
      await waitFor(() => {
        const hoverCard = getHoverCard();
        expect(hoverCard).toHaveAttribute("data-closed");
      });
    });
  },
};
