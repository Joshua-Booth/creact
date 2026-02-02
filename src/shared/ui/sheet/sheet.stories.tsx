import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, userEvent, within } from "storybook/test";

import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

const SHEET_SIDES = ["top", "right", "bottom", "left"] as const;

/**
 * Extends the Dialog component to display content that complements the main
 * content of the screen.
 */
const meta: Meta<typeof SheetContent> = {
  title: "ui/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  argTypes: {
    side: {
      options: ["top", "bottom", "left", "right"],
      control: {
        type: "radio",
      },
    },
  },
  args: {
    side: "right",
  },
  render: (args) => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>Open</SheetTrigger>
      <SheetContent {...args}>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 px-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose render={<Button />}>Save changes</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof SheetContent>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the sheet with a profile editing form.
 */
export const Default: Story = {};

/**
 * Use the `side` prop to display the sheet from different edges of the screen.
 */
export const Side: Story = {
  render: function Side(args) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {SHEET_SIDES.map((side) => (
          <Sheet key={side}>
            <SheetTrigger
              render={<Button variant="outline" className="capitalize" />}
            >
              {side}
            </SheetTrigger>
            <SheetContent {...args} side={side}>
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 px-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={`name-${side}`} className="text-right">
                    Name
                  </Label>
                  <Input
                    id={`name-${side}`}
                    defaultValue="Pedro Duarte"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={`username-${side}`} className="text-right">
                    Username
                  </Label>
                  <Input
                    id={`username-${side}`}
                    defaultValue="@peduarte"
                    className="col-span-3"
                  />
                </div>
              </div>
              <SheetFooter>
                <SheetClose render={<Button />}>Save changes</SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        ))}
      </div>
    );
  },
};

/**
 * Use `showCloseButton={false}` to hide the close button in the corner.
 */
export const NoCloseButton: Story = {
  args: {
    showCloseButton: false,
  },
};

export const ShouldOpenCloseWithSubmit: Story = {
  name: "when clicking Save changes button, should close the sheet",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("open the sheet", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /open/i })
      );
      const sheet = await canvasBody.findByRole("dialog");
      await expect(sheet).toBeInTheDocument();
      await expect(sheet).toHaveAttribute("data-open");
    });

    await step("close the sheet", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /save changes/i })
      );
      await expect(await canvasBody.findByRole("dialog")).toHaveAttribute(
        "data-closed"
      );
    });
  },
};

export const ShouldOpenCloseWithClose: Story = {
  name: "when clicking Close icon, should close the sheet",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("open the sheet", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /open/i })
      );
      const sheet = await canvasBody.findByRole("dialog");
      await expect(sheet).toBeInTheDocument();
      await expect(sheet).toHaveAttribute("data-open");
    });

    await step("close the sheet", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /close/i })
      );
      await expect(await canvasBody.findByRole("dialog")).toHaveAttribute(
        "data-closed"
      );
    });
  },
};
