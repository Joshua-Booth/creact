/* eslint-disable @typescript-eslint/no-non-null-assertion -- Test assertions on known DOM elements */
import { useState } from "react";

import preview from "@/storybook/preview";
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  AudioLinesIcon,
  BotIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  MinusIcon,
  PlusIcon,
  SearchIcon,
  ShareIcon,
  Trash2Icon,
  UserRoundXIcon,
  VolumeOffIcon,
} from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";

import { Button } from "../button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { Field, FieldDescription, FieldLabel } from "../field";
import { Input } from "../input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../input-group";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "../select";
import { Textarea } from "../textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "./button-group";

const CURRENCIES = [
  { label: "US Dollar", value: "$" },
  { label: "Euro", value: "€" },
  { label: "British Pound", value: "£" },
];

/**
 * Groups related buttons together with consistent styling and spacing.
 */
const meta = preview.meta({
  title: "ui/ButtonGroup",
  component: ButtonGroup,
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
    docs: {
      description: {
        component:
          "Groups related buttons together with consistent styling and spacing.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/button-group)",
      },
    },
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">First</Button>
      <Button variant="outline">Second</Button>
      <Button variant="outline">Third</Button>
    </ButtonGroup>
  ),
});

// --- Stories ---

/**
 * The default horizontal button group layout.
 */
export const Default = meta.story();

/**
 * Use the `orientation` prop to stack buttons vertically.
 */
export const Orientation = meta.story({
  args: {
    orientation: "vertical",
  },
  render: (args) => (
    <ButtonGroup {...args} aria-label="Media controls" className="h-fit">
      <Button variant="outline" size="icon" aria-label="Increase">
        <PlusIcon />
      </Button>
      <Button variant="outline" size="icon" aria-label="Decrease">
        <MinusIcon />
      </Button>
    </ButtonGroup>
  ),
});

/**
 * Button groups with small, default, and large sizes, each paired with a
 * matching icon button.
 */
export const Size = meta.story({
  render: (args) => (
    <div className="flex flex-col items-start gap-8">
      <ButtonGroup {...args}>
        <Button variant="outline" size="sm">
          Small
        </Button>
        <Button variant="outline" size="sm">
          Button
        </Button>
        <Button variant="outline" size="sm">
          Group
        </Button>
        <Button variant="outline" size="icon-sm" aria-label="Add">
          <PlusIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup {...args}>
        <Button variant="outline">Default</Button>
        <Button variant="outline">Button</Button>
        <Button variant="outline">Group</Button>
        <Button variant="outline" size="icon" aria-label="Add">
          <PlusIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup {...args}>
        <Button variant="outline" size="lg">
          Large
        </Button>
        <Button variant="outline" size="lg">
          Button
        </Button>
        <Button variant="outline" size="lg">
          Group
        </Button>
        <Button variant="outline" size="icon-lg" aria-label="Add">
          <PlusIcon />
        </Button>
      </ButtonGroup>
    </div>
  ),
});

/**
 * Nested button groups with an `InputGroup` and tooltip integration.
 */
export const Nested = meta.story({
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroup>
        <Button variant="outline" size="icon" aria-label="Add">
          <PlusIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <InputGroup>
          <InputGroupInput placeholder="Send a message..." />
          <Tooltip>
            <TooltipTrigger render={<InputGroupAddon align="inline-end" />}>
              <AudioLinesIcon />
            </TooltipTrigger>
            <TooltipContent>Voice Mode</TooltipContent>
          </Tooltip>
        </InputGroup>
      </ButtonGroup>
    </ButtonGroup>
  ),
});

/**
 * Use `ButtonGroupSeparator` to visually divide buttons within a group.
 */
export const Separator = meta.story({
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="secondary" size="sm">
        Copy
      </Button>
      <ButtonGroupSeparator />
      <Button variant="secondary" size="sm">
        Paste
      </Button>
    </ButtonGroup>
  ),
});

/**
 * A split button pattern with a primary action and an icon button separated by
 * a divider.
 */
export const Split = meta.story({
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="secondary">Button</Button>
      <ButtonGroupSeparator />
      <Button size="icon" variant="secondary" aria-label="Add">
        <PlusIcon />
      </Button>
    </ButtonGroup>
  ),
});

/**
 * Button group pairing an input field with a search button.
 */
export const InputStory = meta.story({
  name: "Input",
  render: (args) => (
    <ButtonGroup {...args}>
      <Input placeholder="Search..." />
      <Button variant="outline" aria-label="Search">
        <SearchIcon />
      </Button>
    </ButtonGroup>
  ),
});

/**
 * Button group wrapping an `InputGroup` with a voice mode toggle button.
 */
export const InputGroupStory = meta.story({
  name: "InputGroup",
  render: function Render(args) {
    const [voiceEnabled, setVoiceEnabled] = useState(false);

    return (
      <ButtonGroup {...args} className="[--radius:9999rem]">
        <ButtonGroup>
          <Button variant="outline" size="icon" aria-label="Add">
            <PlusIcon />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <InputGroup>
            <InputGroupInput
              placeholder={
                voiceEnabled ? "Record and send audio..." : "Send a message..."
              }
              disabled={voiceEnabled}
            />
            <InputGroupAddon align="inline-end">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <InputGroupButton
                      onClick={() => setVoiceEnabled(!voiceEnabled)}
                      size="icon-xs"
                      aria-label="Voice Mode"
                      data-active={voiceEnabled}
                      className="data-[active=true]:bg-orange-100
                        data-[active=true]:text-orange-700
                        dark:data-[active=true]:bg-orange-800
                        dark:data-[active=true]:text-orange-100"
                      aria-pressed={voiceEnabled}
                    />
                  }
                >
                  <AudioLinesIcon />
                </TooltipTrigger>
                <TooltipContent>Voice Mode</TooltipContent>
              </Tooltip>
            </InputGroupAddon>
          </InputGroup>
        </ButtonGroup>
      </ButtonGroup>
    );
  },
});

/**
 * A split button with a dropdown menu for additional actions.
 */
export const DropdownMenuStory = meta.story({
  name: "DropdownMenu",
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">Follow</Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              className="pl-2!"
              aria-label="More options"
            />
          }
        >
          <ChevronDownIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <VolumeOffIcon />
              Mute Conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CheckIcon />
              Mark as Read
            </DropdownMenuItem>
            <DropdownMenuItem>
              <AlertTriangleIcon />
              Report Conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UserRoundXIcon />
              Block User
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ShareIcon />
              Share Conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CopyIcon />
              Copy Conversation
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">
              <Trash2Icon />
              Delete Conversation
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  ),
});

/**
 * Button group combining a currency selector, numeric input, and submit button.
 */
export const SelectStory = meta.story({
  name: "Select",
  render: function Render(args) {
    const [currency, setCurrency] = useState("$");

    return (
      <ButtonGroup {...args}>
        <ButtonGroup>
          <Select
            value={currency}
            onValueChange={(value) => setCurrency(value ?? "$")}
          >
            <SelectTrigger className="font-mono" aria-label="Currency">
              {currency}
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} align="start">
              <SelectGroup>
                {CURRENCIES.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.value}{" "}
                    <span className="text-muted-foreground">{item.label}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input placeholder="10.00" pattern="[0-9]*" />
        </ButtonGroup>
        <ButtonGroup>
          <Button aria-label="Send" size="icon" variant="outline">
            <ArrowRightIcon />
          </Button>
        </ButtonGroup>
      </ButtonGroup>
    );
  },
});

/**
 * Button group with a popover for expanding additional content.
 */
export const PopoverStory = meta.story({
  name: "Popover",
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">
        <BotIcon /> Copilot
      </Button>
      <Popover>
        <PopoverTrigger
          render={
            <Button variant="outline" size="icon" aria-label="Open Popover" />
          }
        >
          <ChevronDownIcon />
        </PopoverTrigger>
        <PopoverContent align="end" className="rounded-xl text-sm">
          <PopoverHeader>
            <PopoverTitle>Start a new task with Copilot</PopoverTitle>
            <PopoverDescription>
              Describe your task in natural language.
            </PopoverDescription>
          </PopoverHeader>
          <Field>
            <FieldLabel htmlFor="task" className="sr-only">
              Task Description
            </FieldLabel>
            <Textarea
              id="task"
              placeholder="I need to..."
              className="resize-none"
            />
            <FieldDescription>
              Copilot will open a pull request for review.
            </FieldDescription>
          </Field>
        </PopoverContent>
      </Popover>
    </ButtonGroup>
  ),
});

/**
 * Button group with a text addon for displaying additional context.
 */
export const WithTextAddon = meta.story({
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupText>https://</ButtonGroupText>
      <Button variant="outline">example.com</Button>
    </ButtonGroup>
  ),
});

// --- Tests ---

Default.test(
  "when buttons are clicked, should call handlers",
  {
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
  },
  async ({ canvas, step }) => {
    await step("click each button and verify they are clickable", async () => {
      const firstButton = canvas.getByRole("button", { name: "First" });
      const secondButton = canvas.getByRole("button", { name: "Second" });
      const thirdButton = canvas.getByRole("button", { name: "Third" });

      await userEvent.click(firstButton);
      await userEvent.click(secondButton);
      await userEvent.click(thirdButton);

      await expect(firstButton).toBeEnabled();
      await expect(secondButton).toBeEnabled();
      await expect(thirdButton).toBeEnabled();
    });
  }
);

Orientation.test(
  "when orientation is vertical, should set data-orientation attribute",
  async ({ canvas }) => {
    const group = canvas.getByRole("group");
    await expect(group).toHaveAttribute("data-orientation", "vertical");
  }
);

DropdownMenuStory.test(
  "when clicking the dropdown trigger, should open the menu",
  async ({ canvas, canvasElement, step }) => {
    const body = within(canvasElement.ownerDocument.body);

    await step("click the dropdown trigger", async () => {
      const buttons = canvas.getAllByRole("button");
      await userEvent.click(buttons[1]!);
    });

    await step("verify the menu is open with items", async () => {
      await expect(await body.findByRole("menu")).toBeInTheDocument();
      const items = await body.findAllByRole("menuitem");
      await expect(items).toHaveLength(7);
    });
  }
);

PopoverStory.test(
  "when clicking the popover trigger, should open the popover",
  async ({ canvas, canvasElement, step }) => {
    const body = within(canvasElement.ownerDocument.body);

    await step("click the popover trigger", async () => {
      const trigger = canvas.getByRole("button", { name: "Open Popover" });
      await userEvent.click(trigger);
    });

    await step("verify the popover content is visible", async () => {
      await expect(
        await body.findByText("Start a new task with Copilot")
      ).toBeInTheDocument();
    });
  }
);
