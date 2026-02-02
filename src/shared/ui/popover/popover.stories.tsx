import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, userEvent, within } from "storybook/test";

import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "./popover";

/**
 * Displays rich content in a portal, triggered by a button.
 */
const meta = {
  title: "ui/Popover",
  component: Popover,
  tags: ["autodocs"],
  argTypes: {},

  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger
        render={<Button variant="outline">Open popover</Button>}
      />
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Popover</PopoverTitle>
          <PopoverDescription>
            Place content for the popover here.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the popover.
 */
export const Default: Story = {};

export const ShouldOpenClose: Story = {
  name: "when clicking the trigger, should open and close the popover",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("click the trigger to open the popover", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /open popover/i })
      );
      await expect(await canvasBody.findByRole("dialog")).toBeInTheDocument();
    });

    await step("click the trigger to close the popover", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /open popover/i })
      );
      await expect(await canvasBody.findByRole("dialog")).toHaveAttribute(
        "data-closed"
      );
    });
  },
};

/**
 * A popover containing a form with input fields.
 */
export const WithForm: Story = {
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger
        render={<Button variant="outline">Open popover</Button>}
      />
      <PopoverContent className="w-80">
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>
            Set the dimensions for the layer.
          </PopoverDescription>
        </PopoverHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="width">Width</Label>
            <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="maxWidth">Max. width</Label>
            <Input
              id="maxWidth"
              defaultValue="300px"
              className="col-span-2 h-8"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="height">Height</Label>
            <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="maxHeight">Max. height</Label>
            <Input
              id="maxHeight"
              defaultValue="none"
              className="col-span-2 h-8"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

/**
 * Popovers can be positioned on different sides of the trigger element.
 */
export const Positions: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Popover {...args}>
        <PopoverTrigger render={<Button variant="outline">Top</Button>} />
        <PopoverContent side="top">
          <PopoverHeader>
            <PopoverTitle>Top Position</PopoverTitle>
            <PopoverDescription>
              This popover appears above the trigger.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>

      <Popover {...args}>
        <PopoverTrigger render={<Button variant="outline">Bottom</Button>} />
        <PopoverContent side="bottom">
          <PopoverHeader>
            <PopoverTitle>Bottom Position</PopoverTitle>
            <PopoverDescription>
              This popover appears below the trigger.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>

      <Popover {...args}>
        <PopoverTrigger render={<Button variant="outline">Left</Button>} />
        <PopoverContent side="left">
          <PopoverHeader>
            <PopoverTitle>Left Position</PopoverTitle>
            <PopoverDescription>
              This popover appears to the left of the trigger.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>

      <Popover {...args}>
        <PopoverTrigger render={<Button variant="outline">Right</Button>} />
        <PopoverContent side="right">
          <PopoverHeader>
            <PopoverTitle>Right Position</PopoverTitle>
            <PopoverDescription>
              This popover appears to the right of the trigger.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

/**
 * Popovers can be aligned along the edge of the trigger element.
 */
export const Align: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Popover {...args}>
        <PopoverTrigger render={<Button variant="outline">Start</Button>} />
        <PopoverContent align="start">
          <PopoverHeader>
            <PopoverTitle>Start Alignment</PopoverTitle>
            <PopoverDescription>
              This popover aligns to the start of the trigger.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>

      <Popover {...args}>
        <PopoverTrigger render={<Button variant="outline">Center</Button>} />
        <PopoverContent align="center">
          <PopoverHeader>
            <PopoverTitle>Center Alignment</PopoverTitle>
            <PopoverDescription>
              This popover aligns to the center of the trigger.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>

      <Popover {...args}>
        <PopoverTrigger render={<Button variant="outline">End</Button>} />
        <PopoverContent align="end">
          <PopoverHeader>
            <PopoverTitle>End Alignment</PopoverTitle>
            <PopoverDescription>
              This popover aligns to the end of the trigger.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    </div>
  ),
};
