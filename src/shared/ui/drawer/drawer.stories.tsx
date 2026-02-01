import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, fn, userEvent, within } from "storybook/test";

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
const meta = {
  title: "ui/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  args: {
    onOpenChange: fn(),
    onClose: fn(),
    onAnimationEnd: fn(),
  },
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger>Open</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you sure absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose className="bg-primary text-primary-foreground rounded px-4 py-2">
            Submit
          </DrawerClose>
          <DrawerClose className="hover:underline">Cancel</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Drawer>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the drawer.
 */
export const Default: Story = {};

/**
 * Drawer opening from the left side of the screen.
 */
export const Left: Story = {
  args: {
    direction: "left",
  },
};

/**
 * Drawer opening from the right side of the screen.
 */
export const Right: Story = {
  args: {
    direction: "right",
  },
};

/**
 * Drawer opening from the top of the screen.
 */
export const Top: Story = {
  args: {
    direction: "top",
  },
};

/**
 * Drawer with scrollable content for long forms or lists.
 */
export const Scrollable: Story = {
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger>Open</DrawerTrigger>
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
          <DrawerClose className="bg-primary text-primary-foreground rounded px-4 py-2">
            Close
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const ShouldOpenCloseWithSubmit: Story = {
  name: "when clicking Submit button, should close the drawer",
  tags: ["!dev", "!autodocs"],
  play: async ({ args, canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("Open the drawer", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /open/i })
      );
      await expect(args.onOpenChange).toHaveBeenCalled();

      const dialog = await canvasBody.findByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute("data-state", "open");
    });

    await step("Close the drawer", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /submit/i }),
        { delay: 100 }
      );
      await expect(args.onClose).toHaveBeenCalled();
      expect(await canvasBody.findByRole("dialog")).toHaveAttribute(
        "data-state",
        "closed"
      );
    });
  },
};

export const ShouldOpenCloseWithCancel: Story = {
  name: "when clicking Cancel button, should close the drawer",
  tags: ["!dev", "!autodocs"],
  play: async ({ args, canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("Open the drawer", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /open/i })
      );
      await expect(args.onOpenChange).toHaveBeenCalled();

      const dialog = await canvasBody.findByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute("data-state", "open");
    });

    await step("Close the drawer", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /cancel/i }),
        { delay: 100 }
      );
      await expect(args.onClose).toHaveBeenCalled();
      expect(await canvasBody.findByRole("dialog")).toHaveAttribute(
        "data-state",
        "closed"
      );
    });
  },
};
