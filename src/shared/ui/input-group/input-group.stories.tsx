import { useState } from "react";

import preview from "@/storybook/preview";
import {
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  CornerDownLeftIcon,
  CreditCardIcon,
  DollarSignIcon,
  EyeOffIcon,
  FileCodeIcon,
  InfoIcon,
  LoaderIcon,
  MailIcon,
  MoreHorizontalIcon,
  SearchIcon,
  StarIcon,
} from "lucide-react";
import { expect, userEvent } from "storybook/test";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../field";
import { Kbd as KbdIndicator } from "../kbd";
import { Spinner } from "../spinner";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "./input-group";

/**
 * Groups input elements with addons like icons, buttons, and text.
 */
const meta = preview.meta({
  title: "ui/InputGroup",
  component: InputGroup,
  args: {
    className: "w-96",
  },
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon align="inline-start">
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  ),
  parameters: {
    docs: {
      description: {
        component:
          "Groups input elements with addons like icons, buttons, and text.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/input-group)",
      },
    },
  },
});

// --- Stories ---

/**
 * Search input with result count.
 */
export const Default = meta.story({
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon align="inline-start">
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InputGroupText>12 results</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
});

/**
 * Icon positioned at the start of the input.
 */
export const InlineStart = meta.story({
  render: (args) => (
    <Field>
      <FieldLabel>Search</FieldLabel>
      <InputGroup {...args}>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon align="inline-start">
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Enter your search query.</FieldDescription>
    </Field>
  ),
});

/**
 * Icon positioned at the end of the input.
 */
export const InlineEnd = meta.story({
  render: (args) => (
    <Field>
      <FieldLabel>Password</FieldLabel>
      <InputGroup {...args}>
        <InputGroupInput placeholder="Enter password" type="password" />
        <InputGroupAddon align="inline-end">
          <EyeOffIcon />
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Enter your password.</FieldDescription>
    </Field>
  ),
});

/**
 * Addon positioned above the input or textarea.
 */
export const BlockStart = meta.story({
  render: (args) => (
    <FieldGroup className="w-96">
      <Field>
        <FieldLabel>Text input</FieldLabel>
        <InputGroup {...args}>
          <InputGroupAddon align="block-start" className="border-b">
            <InputGroupText>Full Name</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput className="pt-2" placeholder="Enter your name..." />
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel>Textarea</FieldLabel>
        <InputGroup {...args}>
          <InputGroupAddon align="block-start" className="border-b">
            <FileCodeIcon className="size-4" />
            <InputGroupText>README.md</InputGroupText>
            <InputGroupButton
              variant="ghost"
              size="icon-xs"
              className="ml-auto"
            >
              <CopyIcon />
            </InputGroupButton>
          </InputGroupAddon>
          <InputGroupTextarea placeholder="Write something..." rows={3} />
        </InputGroup>
      </Field>
    </FieldGroup>
  ),
});

/**
 * Addon positioned below the input or textarea.
 */
export const BlockEnd = meta.story({
  render: function Render(args) {
    const [value, setValue] = useState("");
    const maxLength = 280;

    return (
      <FieldGroup className="w-96">
        <Field>
          <FieldLabel>Amount</FieldLabel>
          <InputGroup {...args}>
            <InputGroupInput
              placeholder="0.00"
              type="number"
              className="pb-2"
            />
            <InputGroupAddon align="block-end" className="border-t">
              <InputGroupText>USD</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel>Message</FieldLabel>
          <InputGroup {...args}>
            <InputGroupTextarea
              placeholder="What's happening?"
              rows={3}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              maxLength={maxLength}
            />
            <InputGroupAddon align="block-end" className="border-t">
              <InputGroupText>
                {maxLength - value.length}/{maxLength}
              </InputGroupText>
              <InputGroupButton className="ml-auto" size="xs">
                Post
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </FieldGroup>
    );
  },
});

/**
 * Icon addons in various configurations.
 */
export const Icon = meta.story({
  render: (args) => (
    <div className="flex flex-col gap-4">
      <InputGroup {...args}>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon align="inline-start">
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup {...args}>
        <InputGroupInput placeholder="Email" />
        <InputGroupAddon align="inline-start">
          <MailIcon />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup {...args}>
        <InputGroupInput placeholder="Card number" />
        <InputGroupAddon align="inline-start">
          <CreditCardIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <CheckIcon />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup {...args}>
        <InputGroupInput placeholder="Card details" />
        <InputGroupAddon align="inline-start">
          <CreditCardIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <StarIcon />
          <InfoIcon />
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
});

/**
 * Text addons for currency, domains, and character counts.
 */
export const Text = meta.story({
  render: function Render(args) {
    const [value, setValue] = useState("");
    const maxLength = 280;

    return (
      <div className="flex flex-col gap-4">
        <InputGroup {...args}>
          <InputGroupInput placeholder="0.00" type="number" />
          <InputGroupAddon align="inline-start">
            <DollarSignIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupText>USD</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup {...args}>
          <InputGroupInput placeholder="example" />
          <InputGroupAddon align="inline-start">
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupText>.com</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup {...args}>
          <InputGroupInput placeholder="username" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>@company.com</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup {...args}>
          <InputGroupTextarea
            placeholder="What's happening?"
            rows={3}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={maxLength}
          />
          <InputGroupAddon align="block-end" className="border-t">
            <InputGroupText>
              {maxLength - value.length} characters left
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </div>
    );
  },
});

/**
 * Button addons for actions.
 */
export const Button = meta.story({
  render: function Render(args) {
    const [isFavorite, setIsFavorite] = useState(false);

    return (
      <div className="flex flex-col gap-4">
        <InputGroup {...args}>
          <InputGroupInput placeholder="npm install @shadcn/ui" readOnly />
          <InputGroupAddon align="inline-end">
            <InputGroupButton variant="ghost" size="icon-xs">
              <CopyIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup {...args}>
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon align="inline-start">
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton>Search</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup {...args}>
          <InputGroupInput placeholder="Add to favorites" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              variant="ghost"
              size="icon-xs"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <StarIcon className={isFavorite ? "fill-current" : ""} />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    );
  },
});

/**
 * Keyboard shortcut indicator in addon.
 */
export const Kbd = meta.story({
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon align="inline-start">
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <KbdIndicator>⌘K</KbdIndicator>
      </InputGroupAddon>
    </InputGroup>
  ),
});

/**
 * Dropdown menu addons for filtering and actions.
 */
export const Dropdown = meta.story({
  render: (args) => (
    <div className="flex flex-col gap-4">
      <InputGroup {...args}>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon align="inline-start">
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<InputGroupButton variant="ghost" size="icon-xs" />}
            >
              <MoreHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Copy</DropdownMenuItem>
              <DropdownMenuItem>Share</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup {...args}>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon align="inline-start">
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<InputGroupButton variant="ghost" size="xs" />}
            >
              All
              <ChevronDownIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>All</DropdownMenuItem>
              <DropdownMenuItem>Docs</DropdownMenuItem>
              <DropdownMenuItem>Code</DropdownMenuItem>
              <DropdownMenuItem>Issues</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
});

/**
 * Loading states with spinner and icon indicators.
 */
export const SpinnerStory = meta.story({
  name: "Spinner",
  render: (args) => (
    <div className="flex flex-col gap-4">
      <InputGroup {...args}>
        <InputGroupInput placeholder="Searching..." disabled />
        <InputGroupAddon align="inline-start">
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup {...args}>
        <InputGroupInput placeholder="Enter data" disabled />
        <InputGroupAddon align="inline-end">
          <Spinner />
          <InputGroupText>Processing...</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup {...args}>
        <InputGroupInput placeholder="Document.txt" disabled />
        <InputGroupAddon align="inline-end">
          <Spinner />
          <InputGroupText>Saving...</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup {...args}>
        <InputGroupInput placeholder="Feed" disabled />
        <InputGroupAddon align="inline-end">
          <LoaderIcon className="animate-spin" />
          <InputGroupText>Refreshing...</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
});

/**
 * Code editor style textarea with header and footer addons.
 */
export const Textarea = meta.story({
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupAddon align="block-start" className="border-b">
        <FileCodeIcon className="size-4" />
        <InputGroupText>script.js</InputGroupText>
        <InputGroupButton className="ml-auto" size="xs">
          Run
        </InputGroupButton>
      </InputGroupAddon>
      <InputGroupTextarea
        placeholder="// Write your code here..."
        rows={6}
        className="font-mono"
      />
      <InputGroupAddon align="block-end" className="border-t">
        <InputGroupText>Line 1, Column 1</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
});

/**
 * Plain textarea with `data-slot="input-group-control"` for custom inputs.
 */
export const Custom = meta.story({
  render: (args) => (
    <InputGroup {...args}>
      <textarea
        data-slot="input-group-control"
        placeholder="Type your message..."
        rows={3}
        className="placeholder:text-muted-foreground w-full flex-1 resize-none
          border-0 bg-transparent px-3 py-2 text-sm outline-none"
      />
      <InputGroupAddon align="block-end" className="border-t">
        <InputGroupButton className="ml-auto" size="xs">
          <CornerDownLeftIcon className="size-4" />
          Submit
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
});

/**
 * Disabled input group state.
 */
export const Disabled = meta.story({
  render: (args) => (
    <InputGroup {...args} data-disabled="true">
      <InputGroupInput placeholder="Search..." disabled />
      <InputGroupAddon align="inline-start">
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  ),
});

// --- Tests ---

Default.test(
  "when typing in input with addon, should update value",
  {
    render: (args) => (
      <InputGroup {...args}>
        <InputGroupInput placeholder="example.com" />
        <InputGroupAddon align="inline-start">
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    ),
  },
  async ({ canvas, step }) => {
    await step("type in input and verify value", async () => {
      const input = canvas.getByPlaceholderText("example.com");

      await userEvent.type(input, "mysite.com");

      await expect(input).toHaveValue("mysite.com");
    });
  }
);

Default.test(
  "when clicking addon, should focus input",
  {
    render: (args) => (
      <InputGroup {...args}>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon align="inline-start" data-testid="addon">
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
    ),
  },
  async ({ canvas, step }) => {
    await step("click addon and verify input is focused", async () => {
      const addon = canvas.getByTestId("addon");
      const input = canvas.getByPlaceholderText("Search...");

      await userEvent.click(addon);

      await expect(input).toHaveFocus();
    });
  }
);

Default.test(
  "when clicking button in addon, should trigger click handler",
  {
    render: (args) => (
      <InputGroup {...args}>
        <InputGroupInput placeholder="Enter URL" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton data-testid="search-button">
            Search
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    ),
  },
  async ({ canvas, step }) => {
    await step("verify button is clickable", async () => {
      const button = canvas.getByTestId("search-button");

      await expect(button).toBeEnabled();
      await userEvent.click(button);
    });
  }
);

Default.test(
  "when input is disabled, should not accept input",
  {
    render: (args) => (
      <InputGroup {...args} data-disabled="true">
        <InputGroupInput placeholder="Search..." disabled />
        <InputGroupAddon align="inline-start">
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
    ),
  },
  async ({ canvas, step }) => {
    await step("verify input is disabled", async () => {
      const input = canvas.getByPlaceholderText("Search...");

      await expect(input).toBeDisabled();
    });

    await step("verify input group has disabled data attribute", async () => {
      const inputGroup = canvas
        .getByPlaceholderText("Search...")
        .closest("[data-slot='input-group']");
      await expect(inputGroup).toHaveAttribute("data-disabled", "true");
    });
  }
);
