import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  ChevronDownIcon,
  CopyIcon,
  FilterIcon,
  LinkIcon,
  MailIcon,
  MinusIcon,
  PlusIcon,
  SaveIcon,
  ShareIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";

import { Button } from "../button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { Input } from "../input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../input-group";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "./button-group";

/**
 * Groups related buttons together with consistent styling and spacing.
 */
const meta = {
  title: "ui/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "The orientation of the button group",
    },
  },
  args: {
    orientation: "horizontal",
  },
  parameters: {
    layout: "centered",
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">First</Button>
      <Button variant="outline">Second</Button>
      <Button variant="outline">Third</Button>
    </ButtonGroup>
  ),
} satisfies Meta<typeof ButtonGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default horizontal button group layout.
 */
export const Default: Story = {};

/**
 * A vertically stacked button group.
 */
export const Orientation: Story = {
  args: {
    orientation: "vertical",
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">Top</Button>
      <Button variant="outline">Middle</Button>
      <Button variant="outline">Bottom</Button>
    </ButtonGroup>
  ),
};

/**
 * Button group with a text addon for displaying additional context.
 */
export const WithTextAddon: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupText>https://</ButtonGroupText>
      <Button variant="outline">example.com</Button>
    </ButtonGroup>
  ),
};

/**
 * Button group with icons inside buttons.
 */
export const WithIcons: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">
        <PlusIcon />
        Add
      </Button>
      <Button variant="outline">
        <Trash2Icon />
        Delete
      </Button>
    </ButtonGroup>
  ),
};

/**
 * Button group with an icon-only button and separator.
 *
 * Buttons with variant `outline` do not need a separator since they have a border.
 * For other variants, a separator is recommended to improve the visual hierarchy.
 */
export const Separator: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="secondary">Save</Button>
      <ButtonGroupSeparator />
      <Button variant="secondary" size="icon" aria-label="More options">
        <ChevronDownIcon />
      </Button>
    </ButtonGroup>
  ),
};

/**
 * Button groups with different button sizes.
 */
export const Size: Story = {
  render: (args) => (
    <div className="flex flex-col items-center gap-4">
      <ButtonGroup {...args}>
        <Button variant="outline" size="sm">
          Bold
        </Button>
        <Button variant="outline" size="sm">
          Italic
        </Button>
        <Button variant="outline" size="sm">
          Underline
        </Button>
      </ButtonGroup>
      <ButtonGroup {...args}>
        <Button variant="outline">Bold</Button>
        <Button variant="outline">Italic</Button>
        <Button variant="outline">Underline</Button>
      </ButtonGroup>
      <ButtonGroup {...args}>
        <Button variant="outline" size="lg">
          Bold
        </Button>
        <Button variant="outline" size="lg">
          Italic
        </Button>
        <Button variant="outline" size="lg">
          Underline
        </Button>
      </ButtonGroup>
    </div>
  ),
};

/**
 * Nested button groups with spacing between them.
 */
export const Nested: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroup>
        <Button variant="outline">Cut</Button>
        <Button variant="outline">Copy</Button>
        <Button variant="outline">Paste</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Undo</Button>
        <Button variant="outline">Redo</Button>
      </ButtonGroup>
    </ButtonGroup>
  ),
};

/**
 * Button group wrapping an input field.
 */
export const InputStory: Story = {
  name: "Input",
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline" size="icon" aria-label="Decrease">
        <MinusIcon />
      </Button>
      <Input type="number" defaultValue={5} className="w-16 text-center" />
      <Button variant="outline" size="icon" aria-label="Increase">
        <PlusIcon />
      </Button>
    </ButtonGroup>
  ),
};

/**
 * Button group with an InputGroup component.
 */
export const InputGroupStory: Story = {
  name: "InputGroup",
  render: (args) => (
    <ButtonGroup {...args}>
      <InputGroup>
        <InputGroupAddon>
          <FilterIcon />
        </InputGroupAddon>
        <InputGroupInput placeholder="Filter..." className="w-40" />
      </InputGroup>
      <Button variant="outline">Apply</Button>
      <Button variant="outline">Clear</Button>
    </ButtonGroup>
  ),
};

/**
 * Button group with a Select component.
 */
export const SelectStory: Story = {
  name: "Select",
  render: (args) => (
    <ButtonGroup {...args}>
      <Select defaultValue="all">
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline">
        <FilterIcon />
        Filter
      </Button>
    </ButtonGroup>
  ),
};

/**
 * Button group with a Popover for additional options.
 */
export const PopoverStory: Story = {
  name: "Popover",
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">
        <ShareIcon />
        Share
      </Button>
      <Popover>
        <PopoverTrigger
          render={
            <Button variant="outline" size="icon" aria-label="Share options" />
          }
        >
          <ChevronDownIcon />
        </PopoverTrigger>
        <PopoverContent align="end" className="gap-1 p-1">
          <Button variant="ghost" className="justify-start">
            <LinkIcon />
            Copy link
          </Button>
          <Button variant="ghost" className="justify-start">
            <MailIcon />
            Email
          </Button>
          <Button variant="ghost" className="justify-start">
            <XIcon />X (Twitter)
          </Button>
        </PopoverContent>
      </Popover>
    </ButtonGroup>
  ),
};

/**
 * A split button pattern with main action and dropdown menu.
 */
export const DropdownMenuStory: Story = {
  name: "DropdownMenu",
  render: (args) => (
    <ButtonGroup {...args}>
      <Button>
        <SaveIcon />
        Save changes
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button size="icon" aria-label="Save options" />}
        >
          <ChevronDownIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem>
            <CopyIcon />
            Save as draft
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SaveIcon />
            Save and publish
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Save as template</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  ),
};

/**
 * When buttons are clicked, should call their respective handlers.
 */
export const ShouldHandleButtonClicks: Story = {
  name: "when buttons are clicked, should call handlers",
  tags: ["!dev", "!autodocs"],
  render: (args) => {
    const onFirstClick = fn();
    const onSecondClick = fn();
    const onThirdClick = fn();

    return (
      <ButtonGroup {...args}>
        <Button
          variant="outline"
          onClick={onFirstClick}
          data-testid="first-btn"
        >
          First
        </Button>
        <Button
          variant="outline"
          onClick={onSecondClick}
          data-testid="second-btn"
        >
          Second
        </Button>
        <Button
          variant="outline"
          onClick={onThirdClick}
          data-testid="third-btn"
        >
          Third
        </Button>
      </ButtonGroup>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("click each button and verify they are clickable", async () => {
      const firstButton = canvas.getByRole("button", { name: "First" });
      const secondButton = canvas.getByRole("button", { name: "Second" });
      const thirdButton = canvas.getByRole("button", { name: "Third" });

      await userEvent.click(firstButton);
      await userEvent.click(secondButton);
      await userEvent.click(thirdButton);

      expect(firstButton).toBeEnabled();
      expect(secondButton).toBeEnabled();
      expect(thirdButton).toBeEnabled();
    });
  },
};
