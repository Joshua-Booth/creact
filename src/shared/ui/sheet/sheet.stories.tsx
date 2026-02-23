import { withI18n } from "@/storybook/decorators/with-i18n";
import preview from "@/storybook/preview";
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

// --- Helpers ---

const SHEET_SIDES = ["top", "right", "bottom", "left"] as const;

/**
 * Extends the Dialog component to display content that complements the main
 * content of the screen.
 */
const meta = preview.meta({
  title: "ui/Sheet",
  component: SheetContent,
  decorators: [withI18n],
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
              defaultValue="Alex Johnson"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" defaultValue="@alex" className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose render={<Button />}>Save changes</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  parameters: {
    docs: {
      description: {
        component:
          "Extends the Dialog component to display content that complements the main content of the screen. See also [Dialog](?path=/docs/ui-dialog--docs) and [Drawer](?path=/docs/ui-drawer--docs).\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/sheet) · [Base UI docs](https://base-ui.com/react/components/dialog)",
      },
    },
  },
});

// --- Stories ---

/**
 * The default form of the sheet with a profile editing form.
 */
export const Default = meta.story();

/**
 * Use the `side` prop to display the sheet from different edges of the screen.
 */
export const Side = meta.story({
  render: (args) => {
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
                    defaultValue="Alex Johnson"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={`username-${side}`} className="text-right">
                    Username
                  </Label>
                  <Input
                    id={`username-${side}`}
                    defaultValue="@alex"
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
});

/**
 * Use `showCloseButton={false}` to hide the close button in the corner.
 */
export const NoCloseButton = meta.story({
  args: {
    showCloseButton: false,
  },
});

// --- Tests ---

Default.test(
  "when clicking Save changes button, should close the sheet",
  async ({ canvasElement, step }) => {
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
  }
);

Default.test(
  "when clicking Close icon, should close the sheet",
  async ({ canvasElement, step }) => {
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
  }
);
