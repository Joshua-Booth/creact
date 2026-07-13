import preview from "@/storybook/preview";
import {
  CopyIcon,
  FileTextIcon,
  RefreshCwIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { expect } from "storybook/test";

import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "../attachment";
import { Bubble, BubbleContent } from "../bubble";
import { Button } from "../button";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "./message";

/**
 * Chat message row that composes avatars, bubbles, and metadata.
 */
const meta = preview.meta({
  title: "ui/Message",
  component: Message,
  argTypes: {
    align: {
      control: "select",
      options: ["start", "end"],
      description: "Which side of the conversation the message aligns to",
    },
  },
  args: {
    align: "start",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Chat message row that composes avatars, bubbles, and metadata.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/message)",
      },
    },
  },
});

// --- Stories ---

/**
 * A received message with an avatar and a bubble.
 */
export const Default = meta.story({
  render: (args) => (
    <Message {...args} className="w-80">
      <MessageAvatar className="size-8 text-xs">AL</MessageAvatar>
      <MessageContent>
        <Bubble variant="muted">
          <BubbleContent>Morning! Did you see the release notes?</BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  ),
});

/**
 * A sent message aligned to the end of the conversation.
 */
export const Sent = meta.story({
  args: {
    align: "end",
  },
  render: (args) => (
    <Message {...args} className="w-80">
      <MessageContent>
        <Bubble variant="default" align="end">
          <BubbleContent>
            Just read them, the new charts look great!
          </BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  ),
});

/**
 * Use MessageHeader and MessageFooter for sender names and timestamps.
 */
export const HeaderAndFooter = meta.story({
  render: (args) => (
    <MessageGroup className="w-80">
      <Message {...args}>
        <MessageAvatar className="size-8 text-xs">AL</MessageAvatar>
        <MessageContent>
          <MessageHeader>Alex</MessageHeader>
          <Bubble variant="muted">
            <BubbleContent>Lunch at the usual place?</BubbleContent>
          </Bubble>
          <MessageFooter>12:04 PM</MessageFooter>
        </MessageContent>
      </Message>
      <Message {...args} align="end">
        <MessageContent>
          <Bubble variant="default" align="end">
            <BubbleContent>On my way!</BubbleContent>
          </Bubble>
          <MessageFooter>12:05 PM</MessageFooter>
        </MessageContent>
      </Message>
    </MessageGroup>
  ),
});

/**
 * Place message-level actions like copy, retry, and feedback in the
 * MessageFooter.
 */
export const Actions = meta.story({
  render: (args) => (
    <Message {...args} className="w-80">
      <MessageContent>
        <Bubble variant="muted">
          <BubbleContent>
            The dashboard rollout is scheduled for Thursday. I&apos;ll share the
            release notes once QA signs off.
          </BubbleContent>
        </Bubble>
        <MessageFooter className="gap-1">
          <Button variant="ghost" size="icon-xs">
            <CopyIcon />
            <span className="sr-only">Copy message</span>
          </Button>
          <Button variant="ghost" size="icon-xs">
            <RefreshCwIcon />
            <span className="sr-only">Retry</span>
          </Button>
          <Button variant="ghost" size="icon-xs">
            <ThumbsUpIcon />
            <span className="sr-only">Good response</span>
          </Button>
        </MessageFooter>
      </MessageContent>
    </Message>
  ),
});

/**
 * Render file attachments inside the message content, alongside bubbles.
 */
export const WithAttachment = meta.story({
  name: "Attachment",
  args: {
    align: "end",
  },
  render: (args) => (
    <Message {...args} className="w-80">
      <MessageContent>
        <Attachment>
          <AttachmentMedia>
            <FileTextIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>release-notes.pdf</AttachmentTitle>
            <AttachmentDescription>820 KB</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
        <Bubble variant="default" align="end">
          <BubbleContent>Here are the release notes!</BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  ),
});

Actions.test(
  "should expose the message actions to keyboard and AT",
  async ({ canvas }) => {
    await expect(
      canvas.getByRole("button", { name: "Copy message" })
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "Retry" })
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "Good response" })
    ).toBeInTheDocument();
  }
);
