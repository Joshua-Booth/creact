import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, userEvent, within } from "storybook/test";

import { Button } from "../button";
import { Field, FieldGroup } from "../field";
import { Input } from "../input";
import { Label } from "../label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

// cspell:disable
const LOREM_PARAGRAPHS = [
  {
    id: "lorem-1",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    id: "lorem-2",
    text: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
  },
  {
    id: "lorem-3",
    text: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
  },
  {
    id: "lorem-4",
    text: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
  },
  {
    id: "lorem-5",
    text: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.",
  },
  {
    id: "lorem-6",
    text: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.",
  },
  {
    id: "lorem-7",
    text: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati.",
  },
  {
    id: "lorem-8",
    text: "Cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  },
  {
    id: "lorem-9",
    text: "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.",
  },
  {
    id: "lorem-10",
    text: "Omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.",
  },
] as const;
// cspell:enable

/**
 * A window overlaid on either the primary window or another dialog window,
 * rendering the content underneath inert.
 */
const meta = {
  title: "ui/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => (
    <Dialog {...args}>
      <form>
        <DialogTrigger render={<Button variant="outline" />}>
          Open Dialog
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Name</Label>
              {/* cspell:disable-next-line */}
              <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
            </Field>
            <Field>
              <Label htmlFor="username-1">Username</Label>
              {/* cspell:disable-next-line */}
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <DialogClose render={<Button type="submit" />}>
              Save changes
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the dialog with an edit profile form.
 */
export const Default: Story = {};

/**
 * Dialog with a custom close button in the footer for sharing links.
 */
export const CustomCloseButton: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger render={<Button variant="outline" />}>Share</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue="https://ui.shadcn.com/docs/installation"
              readOnly
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose render={<Button type="button" />}>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Dialog without the default close button in the top-right corner.
 */
export const NoCloseButton: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger render={<Button variant="outline" />}>
        No Close Button
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>No Close Button</DialogTitle>
          <DialogDescription>
            This dialog does not have a close button in the top-right corner.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Dialog with a sticky footer that stays visible while the content scrolls.
 */
export const StickyFooter: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger render={<Button variant="outline" />}>
        Sticky Footer
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sticky Footer</DialogTitle>
          <DialogDescription>
            This dialog has a sticky footer that stays visible while the content
            scrolls.
          </DialogDescription>
        </DialogHeader>
        <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
          {LOREM_PARAGRAPHS.map((p) => (
            <p key={p.id} className="mb-4 leading-normal">
              {p.text}
            </p>
          ))}
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Dialog with scrollable content and no footer.
 */
export const ScrollableContent: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger render={<Button variant="outline" />}>
        Scrollable Content
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scrollable Content</DialogTitle>
          <DialogDescription>
            This is a dialog with scrollable content.
          </DialogDescription>
        </DialogHeader>
        <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
          {LOREM_PARAGRAPHS.map((p) => (
            <p key={p.id} className="mb-4 leading-normal">
              {p.text}
            </p>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  ),
};

export const ShouldOpenCloseWithSave: Story = {
  name: "when clicking Save changes button, should close the dialog",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("Open the dialog", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /open dialog/i })
      );
      const dialog = await canvasBody.findByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute("data-open");
    });

    await step("Close the dialog", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /save changes/i })
      );
      expect(await canvasBody.findByRole("dialog")).toHaveAttribute(
        "data-closed"
      );
    });
  },
};

export const ShouldOpenCloseWithCancel: Story = {
  name: "when clicking Cancel button, should close the dialog",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("Open the dialog", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /open dialog/i })
      );
      const dialog = await canvasBody.findByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute("data-open");
    });

    await step("Close the dialog", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /cancel/i })
      );
      expect(await canvasBody.findByRole("dialog")).toHaveAttribute(
        "data-closed"
      );
    });
  },
};

export const ShouldOpenCloseCross: Story = {
  name: "when clicking Close icon, should close the dialog",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("Open the dialog", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /open dialog/i })
      );
      const dialog = await canvasBody.findByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute("data-open");
    });

    await step("Close the dialog", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /close/i })
      );
      expect(await canvasBody.findByRole("dialog")).toHaveAttribute(
        "data-closed"
      );
    });
  },
};
