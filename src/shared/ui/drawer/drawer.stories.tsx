import { useState } from "react";

import preview from "@/storybook/preview";
import { expect, fn, userEvent, within } from "storybook/test";

import { Button } from "../button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";
import { Input } from "../input";
import { Label } from "../label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

/**
 * A drawer component for React.
 */
const meta = preview.meta({
  title: "ui/Drawer",
  component: Drawer,
  args: {
    onOpenChange: fn(),
    onClose: fn(),
    onAnimationEnd: fn(),
  },
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger asChild>
        <Button variant="outline">Open</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you sure absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose
            className="bg-primary text-primary-foreground rounded-sm px-4 py-2"
          >
            Submit
          </DrawerClose>
          <DrawerClose className="hover:underline">Cancel</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
  parameters: {
    docs: {
      description: {
        component:
          "A drawer component for React. See also [Sheet](?path=/docs/ui-sheet--docs) for side panel overlays.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/drawer)",
      },
    },
  },
});

// --- Stories ---

/**
 * The default form of the drawer.
 */
export const Default = meta.story({});

/**
 * Drawer with scrollable content and fixed action buttons. Opens from
 * the right side of the screen.
 */
export const Scrollable = meta.story({
  render: (args) => (
    <Drawer {...args} direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline">Open</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Scrollable Content</DrawerTitle>
          <DrawerDescription>
            This drawer contains scrollable content.
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto px-4">
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i} className="py-2">
              {/* cspell:disable */}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Item{" "}
              {/* cspell:enable */}
              {i + 1}.
            </p>
          ))}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
});

/**
 * Use the `direction` prop to open the drawer from any side of the screen.
 */
export const Sides = meta.story({
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      {(["top", "right", "bottom", "left"] as const).map((direction) => (
        <Drawer key={direction} {...args} direction={direction}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="capitalize">
              {direction}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Drawer from {direction}</DrawerTitle>
              <DrawerDescription>
                This drawer opens from the {direction} of the screen.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  ),
});

/**
 * Responsive pattern: renders as a Dialog on wider viewports and a Drawer
 * on narrow viewports. Uses a toggle to demonstrate both modes.
 */
export const ResponsiveDialog = meta.story({
  name: "Responsive Dialog",
  render: (args) => {
    const [open, setOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(true);

    const form = (
      <form className="grid items-start gap-6 px-4 sm:px-0">
        <div className="grid gap-3">
          <Label htmlFor="dialog-email">Email</Label>
          <Input
            type="email"
            id="dialog-email"
            defaultValue="shadcn@example.com"
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="dialog-username">Username</Label>
          <Input id="dialog-username" defaultValue="@shadcn" />
        </div>
        <Button type="submit">Save changes</Button>
      </form>
    );

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          <Button
            variant={isDesktop ? "default" : "outline"}
            size="sm"
            onClick={() => setIsDesktop(true)}
          >
            Desktop (Dialog)
          </Button>
          <Button
            variant={isDesktop ? "outline" : "default"}
            size="sm"
            onClick={() => setIsDesktop(false)}
          >
            Mobile (Drawer)
          </Button>
        </div>

        {isDesktop ? (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button variant="outline" />}>
              Edit Profile
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when done.
                </DialogDescription>
              </DialogHeader>
              {form}
            </DialogContent>
          </Dialog>
        ) : (
          <Drawer {...args} open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline">Edit Profile</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="text-left">
                <DrawerTitle>Edit profile</DrawerTitle>
                <DrawerDescription>
                  Make changes to your profile here. Click save when done.
                </DrawerDescription>
              </DrawerHeader>
              {form}
              <DrawerFooter className="pt-2">
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    );
  },
});

// --- Tests ---

Default.test(
  "when clicking Submit button, should close the drawer",
  async ({ args, canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("Open the drawer", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /open/i })
      );
      await expect(args.onOpenChange).toHaveBeenCalled();

      const dialog = await canvasBody.findByRole("dialog");
      await expect(dialog).toBeInTheDocument();
      await expect(dialog).toHaveAttribute("data-state", "open");
    });

    await step("Close the drawer", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /submit/i }),
        { delay: 100 }
      );
      await expect(args.onClose).toHaveBeenCalled();
      await expect(await canvasBody.findByRole("dialog")).toHaveAttribute(
        "data-state",
        "closed"
      );
    });
  }
);

Default.test(
  "when clicking Cancel button, should close the drawer",
  async ({ args, canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("Open the drawer", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /open/i })
      );
      await expect(args.onOpenChange).toHaveBeenCalled();

      const dialog = await canvasBody.findByRole("dialog");
      await expect(dialog).toBeInTheDocument();
      await expect(dialog).toHaveAttribute("data-state", "open");
    });

    await step("Close the drawer", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /cancel/i }),
        { delay: 100 }
      );
      await expect(args.onClose).toHaveBeenCalled();
      await expect(await canvasBody.findByRole("dialog")).toHaveAttribute(
        "data-state",
        "closed"
      );
    });
  }
);

Sides.test(
  "when clicking a direction button, should open the drawer from that side",
  async ({ canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("Open a right-side drawer", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /right/i })
      );
      const dialog = await canvasBody.findByRole("dialog");
      await expect(dialog).toBeInTheDocument();
      await expect(dialog).toHaveAttribute("data-state", "open");
    });

    await step("Close the drawer", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /close/i })
      );
      await expect(await canvasBody.findByRole("dialog")).toHaveAttribute(
        "data-state",
        "closed"
      );
    });
  }
);

ResponsiveDialog.test(
  "when toggling to mobile mode, should render a drawer instead of a dialog",
  async ({ canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("Switch to mobile mode", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /mobile/i })
      );
    });

    await step("Open the drawer", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /edit profile/i })
      );
      const dialog = await canvasBody.findByRole("dialog");
      await expect(dialog).toBeInTheDocument();
    });
  }
);
