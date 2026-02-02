import type { Meta, StoryObj } from "@storybook/react-vite";

import { CommandIcon, PrinterIcon, SearchIcon } from "lucide-react";

import { Button } from "../button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip";
import { Kbd, KbdGroup } from "./kbd";

/**
 * Displays keyboard keys or shortcuts in a styled format.
 */
const meta = {
  title: "ui/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "The key label or content",
    },
  },
  args: {
    children: "K",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Kbd>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A single keyboard key.
 */
export const Default: Story = {};

/**
 * Use KbdGroup to display keyboard shortcut combinations.
 */
export const Group: Story = {
  render: (args) => (
    <KbdGroup>
      <Kbd>
        <CommandIcon />
      </Kbd>
      <Kbd {...args} />
    </KbdGroup>
  ),
};

/**
 * Kbd can be placed inside a Button to indicate a keyboard shortcut.
 */
export const WithButton: Story = {
  args: {
    children: "↵",
  },
  render: (args) => (
    <Button variant="outline">
      Submit
      <Kbd data-icon="inline-end" {...args} />
    </Button>
  ),
};

/**
 * Combine tooltips with Kbd to show keyboard shortcuts on hover.
 */
export const WithTooltip: Story = {
  args: {
    children: "S",
  },
  render: (args) => (
    <TooltipProvider>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>
            Save
          </TooltipTrigger>
          <TooltipContent>
            <KbdGroup>
              <Kbd>
                <CommandIcon />
              </Kbd>
              <Kbd {...args} />
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>
            <PrinterIcon />
            <span className="sr-only">Print</span>
          </TooltipTrigger>
          <TooltipContent>
            <KbdGroup>
              <Kbd>
                <CommandIcon />
              </Kbd>
              <Kbd>P</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};

/**
 * Kbd can be used inside an InputGroup to show search shortcuts.
 */
export const WithInputGroup: Story = {
  render: (args) => (
    <InputGroup className="w-64">
      <InputGroupAddon align="inline-start">
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon align="inline-end">
        <KbdGroup>
          <Kbd>
            <CommandIcon />
          </Kbd>
          <Kbd {...args} />
        </KbdGroup>
      </InputGroupAddon>
    </InputGroup>
  ),
};
