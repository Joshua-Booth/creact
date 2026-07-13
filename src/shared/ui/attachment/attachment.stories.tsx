import preview from "@/storybook/preview";
import { FileTextIcon, XIcon } from "lucide-react";
import { expect } from "storybook/test";

import { Spinner } from "../spinner";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "./attachment";

/**
 * File attachment card with upload lifecycle states.
 */
const meta = preview.meta({
  title: "ui/Attachment",
  component: Attachment,
  argTypes: {
    state: {
      control: "select",
      options: ["idle", "uploading", "processing", "error", "done"],
      description: "The upload lifecycle state",
    },
    size: {
      control: "select",
      options: ["default", "sm", "xs"],
      description: "The size of the attachment card",
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "The layout direction of the attachment card",
    },
  },
  args: {
    state: "done",
    size: "default",
    orientation: "horizontal",
  },
  parameters: {
    docs: {
      description: {
        component:
          "File attachment card with upload lifecycle states.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/attachment)",
      },
    },
  },
});

// --- Stories ---

/**
 * An attachment with media, content, and a remove action.
 */
export const Default = meta.story({
  render: (args) => (
    <Attachment {...args}>
      <AttachmentMedia>
        <FileTextIcon />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>quarterly-report.pdf</AttachmentTitle>
        <AttachmentDescription>1.2 MB</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction>
          <XIcon />
          <span className="sr-only">Remove</span>
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  ),
});

/**
 * Use `variant="image"` on AttachmentMedia with a vertical orientation for
 * image previews.
 */
export const Image = meta.story({
  args: {
    orientation: "vertical",
  },
  render: (args) => (
    <Attachment {...args}>
      <AttachmentMedia variant="image">
        <img src="https://github.com/shadcn.png" alt="" />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>avatar.png</AttachmentTitle>
        <AttachmentDescription>1.4 MB</AttachmentDescription>
      </AttachmentContent>
    </Attachment>
  ),
});

/**
 * The upload lifecycle: idle, uploading and processing shimmer the title,
 * error highlights the card in the destructive color.
 */
export const States = meta.story({
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Attachment {...args} state="idle">
        <AttachmentMedia>
          <FileTextIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>quarterly-report.pdf</AttachmentTitle>
          <AttachmentDescription>Ready to upload</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment {...args} state="uploading">
        <AttachmentMedia>
          <Spinner />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>holiday-photos.zip</AttachmentTitle>
          <AttachmentDescription>Uploading… 45%</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment {...args} state="processing">
        <AttachmentMedia>
          <Spinner />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>meeting-notes.md</AttachmentTitle>
          <AttachmentDescription>Processing…</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment {...args} state="error">
        <AttachmentMedia>
          <FileTextIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>big-video.mov</AttachmentTitle>
          <AttachmentDescription>
            File exceeds 25 MB limit
          </AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction>
            <XIcon />
            <span className="sr-only">Remove</span>
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment {...args} state="done">
        <AttachmentMedia>
          <FileTextIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>design-spec.pdf</AttachmentTitle>
          <AttachmentDescription>Uploaded</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    </div>
  ),
});

/**
 * Three sizes for different densities.
 */
export const Sizes = meta.story({
  render: (args) => (
    <div className="flex flex-col gap-3">
      {(["default", "sm", "xs"] as const).map((size) => (
        <Attachment key={size} {...args} size={size}>
          <AttachmentMedia>
            <FileTextIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>quarterly-report.pdf</AttachmentTitle>
            <AttachmentDescription>1.2 MB</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      ))}
    </div>
  ),
});

/**
 * AttachmentTrigger makes the whole card clickable while actions stay
 * independently clickable above it.
 */
export const Trigger = meta.story({
  render: (args) => (
    <Attachment {...args}>
      <AttachmentMedia>
        <FileTextIcon />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>quarterly-report.pdf</AttachmentTitle>
        <AttachmentDescription>Click to open</AttachmentDescription>
      </AttachmentContent>
      <AttachmentTrigger
        render={
          <a
            href="https://example.com/quarterly-report.pdf"
            target="_blank"
            rel="noreferrer"
            aria-label="Open quarterly-report.pdf"
          />
        }
      />
      <AttachmentActions>
        <AttachmentAction>
          <XIcon />
          <span className="sr-only">Remove</span>
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  ),
});

/**
 * Use AttachmentGroup for a horizontally scrollable row of attachments.
 */
export const Group = meta.story({
  render: (args) => (
    <AttachmentGroup className="w-96">
      {["notes.md", "design-spec.pdf", "mockups.fig", "assets.zip"].map(
        (name) => (
          <Attachment key={name} {...args}>
            <AttachmentMedia>
              <FileTextIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{name}</AttachmentTitle>
              <AttachmentDescription>1.0 MB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction>
                <XIcon />
                <span className="sr-only">Remove {name}</span>
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        )
      )}
    </AttachmentGroup>
  ),
});

Trigger.test(
  "should keep the trigger link and actions independently accessible",
  async ({ canvas }) => {
    await expect(
      canvas.getByRole("link", { name: "Open quarterly-report.pdf" })
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "Remove" })
    ).toBeInTheDocument();
  }
);
