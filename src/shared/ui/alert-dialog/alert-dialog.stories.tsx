import preview from "@/storybook/preview";
import { BluetoothIcon, CircleFadingPlusIcon, Trash2Icon } from "lucide-react";
import { expect, userEvent, within } from "storybook/test";

import { Button } from "../button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";

/**
 * A modal dialog that interrupts the user with important content and expects
 * a response.
 */
const meta = preview.meta({
  title: "ui/AlertDialog",
  component: AlertDialog,
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger
        render={<Button variant="outline">Show Dialog</Button>}
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  parameters: {
    docs: {
      description: {
        component:
          "A modal dialog that interrupts the user with important content and expects a response.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/alert-dialog) · [Base UI docs](https://base-ui.com/react/components/alert-dialog)",
      },
    },
  },
});

// --- Stories ---

/**
 * The default form of the alert dialog.
 */
export const Default = meta.story();

/**
 * A smaller alert dialog variant for compact interfaces.
 */
export const Small = meta.story({
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger
        render={<Button variant="outline">Show Dialog</Button>}
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to allow the USB accessory to connect to this device?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
          <AlertDialogAction>Allow</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
});

/**
 * An alert dialog with an icon in the header for visual emphasis.
 */
export const Media = meta.story({
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger
        render={<Button variant="outline">Share Project</Button>}
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <CircleFadingPlusIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>Share this project?</AlertDialogTitle>
          <AlertDialogDescription>
            Anyone with the link will be able to view and edit this project.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Share</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
});

/**
 * A small alert dialog with an icon in the header for compact interfaces.
 */
export const SmallMedia = meta.story({
  name: "Small Media",
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger
        render={<Button variant="outline">Show Dialog</Button>}
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <BluetoothIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to allow the USB accessory to connect to this device?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
          <AlertDialogAction>Allow</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
});

/**
 * A destructive alert dialog for dangerous actions with red styling.
 */
export const Destructive = meta.story({
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger
        render={<Button variant="destructive">Delete Chat</Button>}
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia
            className="bg-destructive/10 text-destructive dark:bg-destructive/20
              dark:text-destructive"
          >
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete chat?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this chat conversation. View{" "}
            <a href="/settings">Settings</a> to delete any memories saved during
            this chat.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
});

// --- Tests ---

Default.test(
  "when trigger is clicked, should open dialog and close via cancel",
  async ({ canvasElement, canvas, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("open the alert dialog", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: /show dialog/i })
      );
    });

    await step("close via cancel button", async () => {
      await userEvent.click(
        canvasBody.getByRole("button", { name: /cancel/i }),
        { delay: 100 }
      );
    });
  }
);

Default.test(
  "when action button is clicked, should be interactive",
  async ({ canvasElement, canvas, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("open the alert dialog", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: /show dialog/i })
      );
    });

    await step("verify action button is enabled and clickable", async () => {
      const actionButton = canvasBody.getByRole("button", {
        name: /continue/i,
      });
      await expect(actionButton).toBeEnabled();
      await userEvent.click(actionButton, { delay: 100 });
    });

    await step("clean up", async () => {
      await userEvent.click(
        canvasBody.getByRole("button", { name: /cancel/i }),
        { delay: 100 }
      );
    });
  }
);

Default.test(
  "when Escape key is pressed, should not dismiss the alert dialog",
  async ({ canvasElement, canvas, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("open the alert dialog", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: /show dialog/i })
      );
    });

    await step("press Escape and verify dialog stays open", async () => {
      await userEvent.keyboard("{Escape}");
      await expect(canvasBody.getByRole("alertdialog")).toBeInTheDocument();
    });

    await step("clean up", async () => {
      await userEvent.click(
        canvasBody.getByRole("button", { name: /cancel/i }),
        { delay: 100 }
      );
    });
  }
);

Default.test(
  "when dialog is open, should render both cancel and action buttons",
  async ({ canvasElement, canvas, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("open the alert dialog", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: /show dialog/i })
      );
    });

    await step("verify dialog content", async () => {
      await expect(canvasBody.getByRole("alertdialog")).toBeInTheDocument();
      await expect(
        canvasBody.getByRole("button", { name: /cancel/i })
      ).toBeInTheDocument();
      await expect(
        canvasBody.getByRole("button", { name: /continue/i })
      ).toBeInTheDocument();
    });

    await step("clean up", async () => {
      await userEvent.click(
        canvasBody.getByRole("button", { name: /cancel/i }),
        { delay: 100 }
      );
    });
  }
);
