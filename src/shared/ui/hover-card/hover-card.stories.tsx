import preview from "@/storybook/preview";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Button } from "../button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

/**
 * For sighted users to preview content available behind a link.
 */
const meta = preview.meta({
  title: "ui/HoverCard",
  component: HoverCard,
  args: {},
  render: (args) => (
    <HoverCard {...args}>
      <HoverCardTrigger
        delay={10}
        closeDelay={100}
        render={<Button variant="link">@nextjs</Button>}
      />
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm">
              The React Framework - created and maintained by @vercel.
            </p>
            <div className="flex items-center pt-2">
              <span className="text-muted-foreground text-xs">
                Joined December 2021
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
  parameters: {
    docs: {
      description: {
        component:
          "For sighted users to preview content available behind a link.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/hover-card) · [Base UI docs](https://base-ui.com/react/components/preview-card)",
      },
    },
  },
});

// --- Stories ---

/**
 * The default form of the hover card.
 */
export const Default = meta.story();

/**
 * Use the `side` prop to control the placement of the hover card relative to
 * the trigger.
 */
export const Sides = meta.story({
  render: (args) => {
    const sides = ["left", "top", "bottom", "right"] as const;

    return (
      <div className="flex flex-wrap justify-center gap-2">
        {sides.map((side) => (
          <HoverCard key={side} {...args}>
            <HoverCardTrigger
              delay={100}
              closeDelay={100}
              render={
                <Button variant="outline" className="capitalize">
                  {side}
                </Button>
              }
            />
            <HoverCardContent side={side}>
              <div className="flex flex-col gap-1">
                <h4 className="font-medium">Hover Card</h4>
                <p>
                  This hover card appears on the {side} side of the trigger.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    );
  },
});

// --- Tests ---

const getHoverCard = (el: HTMLElement) =>
  el.ownerDocument.body.querySelector('[data-slot="hover-card-content"]');

Default.test(
  "when hovering over trigger, should show hover card content",
  async ({ canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);
    const trigger = await canvasBody.findByRole("button", {
      name: /@nextjs/,
    });

    await step("Hover over the trigger element", async () => {
      await userEvent.hover(trigger);
      await waitFor(async () => {
        const hoverCard = getHoverCard(canvasElement);
        await expect(hoverCard).toBeInTheDocument();
        await expect(hoverCard).toHaveAttribute("data-open");
      });
    });
    await step("Unhover the trigger element", async () => {
      await userEvent.unhover(trigger);
      await waitFor(async () => {
        const hoverCard = getHoverCard(canvasElement);
        await expect(hoverCard).toHaveAttribute("data-closed");
      });
    });
  }
);

Default.test(
  "when focusing trigger via keyboard, should show hover card content",
  async ({ canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("Tab to focus the trigger element", async () => {
      await userEvent.tab();
      const trigger = await canvasBody.findByRole("button", {
        name: /@nextjs/,
      });
      await expect(trigger).toHaveFocus();
      await waitFor(async () => {
        const hoverCard = getHoverCard(canvasElement);
        await expect(hoverCard).toBeInTheDocument();
        await expect(hoverCard).toHaveAttribute("data-open");
      });
    });
    await step("Tab away from the trigger element", async () => {
      await userEvent.tab();
      await waitFor(async () => {
        const hoverCard = getHoverCard(canvasElement);
        await expect(hoverCard).toHaveAttribute("data-closed");
      });
    });
  }
);
