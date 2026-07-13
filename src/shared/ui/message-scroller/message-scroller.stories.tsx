import preview from "@/storybook/preview";
import { expect, userEvent, waitFor } from "storybook/test";

import { Bubble, BubbleContent } from "../bubble";
import { Marker, MarkerContent } from "../marker";
import { Message, MessageContent, MessageGroup } from "../message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "./message-scroller";

const conversation = [
  { from: "them", text: "Hey! How did the demo go?" },
  { from: "me", text: "Really well — the client loved the new dashboard." },
  { from: "them", text: "That's great news 🎉" },
  { from: "me", text: "They had a few questions about exports." },
  { from: "them", text: "CSV or PDF?" },
  { from: "me", text: "Both, plus scheduled email reports." },
  { from: "them", text: "We can scope that for next sprint." },
  { from: "me", text: "Perfect, I'll draft the tickets today." },
  { from: "them", text: "Add estimates while you're at it." },
  { from: "me", text: "Will do. Anything else before standup?" },
  { from: "them", text: "Nope, see you at 10!" },
] as const;

function ConversationItem({
  message,
}: {
  message: (typeof conversation)[number];
}) {
  return (
    <MessageGroup>
      <Message align={message.from === "me" ? "end" : "start"}>
        <MessageContent>
          <Bubble
            variant={message.from === "me" ? "default" : "muted"}
            align={message.from === "me" ? "end" : "start"}
          >
            <BubbleContent>{message.text}</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageGroup>
  );
}

/**
 * Conversation scroll container with anchored turns, auto-scroll for
 * streamed replies, and a scroll-to-end button. Wrap everything in
 * MessageScrollerProvider — it owns the scroll state and lets external
 * controls use the scroller hooks.
 */
const meta = preview.meta({
  title: "ui/MessageScroller",
  component: MessageScroller,
  parameters: {
    docs: {
      description: {
        component:
          "Conversation scroll container with anchored turns, auto-scroll for streamed replies, and a scroll-to-end button.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/message-scroller)",
      },
    },
  },
});

// --- Stories ---

/**
 * A scrollable conversation; scroll up to reveal the scroll-to-end button.
 */
export const Default = meta.story({
  render: (args) => (
    <MessageScrollerProvider>
      <MessageScroller {...args} className="h-80 w-96 rounded-lg border">
        <MessageScrollerViewport>
          <MessageScrollerContent className="gap-2 p-4">
            <MessageScrollerItem>
              <Marker variant="separator" className="mb-2">
                <MarkerContent>Today</MarkerContent>
              </Marker>
            </MessageScrollerItem>
            {conversation.map((message) => (
              <MessageScrollerItem key={message.text}>
                <ConversationItem message={message} />
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  ),
});

Default.test("should render the conversation", async ({ canvas }) => {
  // Guards against render errors swallowed by decorator error boundaries
  await expect(canvas.getByText("Nope, see you at 10!")).toBeInTheDocument();
  await expect(
    canvas.getByRole("region", { name: "Messages" })
  ).toBeInTheDocument();
});

Default.test(
  "when scrolled up, should reveal the button and scroll back to the end",
  async ({ canvas, canvasElement, step }) => {
    const viewport = canvas.getByRole("region", { name: "Messages" });
    const button = canvasElement.querySelector<HTMLButtonElement>(
      '[data-slot="message-scroller-button"]'
    );
    if (!button) throw new Error("scroll button not found");

    await step("starts at the end with the button inactive", async () => {
      await waitFor(() =>
        expect(button).toHaveAttribute("data-active", "false")
      );
    });

    await step("scroll to the top to activate the button", async () => {
      viewport.scrollTop = 0;
      await waitFor(() =>
        expect(button).toHaveAttribute("data-active", "true")
      );
    });

    await step("click the button to return to the end", async () => {
      await userEvent.click(button);
      await waitFor(() =>
        expect(
          viewport.scrollTop + viewport.clientHeight
        ).toBeGreaterThanOrEqual(viewport.scrollHeight - 1)
      );
    });
  }
);

/**
 * Mark turns with `scrollAnchor` (and give items a `messageId`) so new
 * exchanges anchor near the top of the viewport instead of the bottom.
 */
export const AnchoredTurns = meta.story({
  render: (args) => (
    <MessageScrollerProvider defaultScrollPosition="last-anchor">
      <MessageScroller {...args} className="h-80 w-96 rounded-lg border">
        <MessageScrollerViewport>
          <MessageScrollerContent className="gap-2 p-4">
            {conversation.map((message) => (
              <MessageScrollerItem
                key={message.text}
                messageId={message.text}
                scrollAnchor={message.from === "me"}
              >
                <ConversationItem message={message} />
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
        <MessageScrollerButton direction="start" />
      </MessageScroller>
    </MessageScrollerProvider>
  ),
});
