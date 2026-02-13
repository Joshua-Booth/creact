import { useState } from "react";

import preview from "@/storybook/preview";
import {
  AtSignIcon,
  DollarSignIcon,
  EyeIcon,
  GlobeIcon,
  SearchIcon,
} from "lucide-react";
import { expect, userEvent, within } from "storybook/test";

import { Kbd } from "../kbd";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
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
  argTypes: {},
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
    layout: "centered",
  },
});

// --- Stories ---

/**
 * Basic input group with a search icon.
 */
export const Default = meta.story();

/**
 * Input group with a text prefix.
 */
export const WithTextPrefix = meta.story({
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupInput placeholder="example.com" />
      <InputGroupAddon align="inline-start">
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
});

/**
 * Input group with a text suffix.
 */
export const WithTextSuffix = meta.story({
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupInput placeholder="username" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>@company.com</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
});

/**
 * Input group with currency prefix and suffix.
 */
export const WithCurrency = meta.story({
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupInput placeholder="0.00" type="number" />
      <InputGroupAddon align="inline-start">
        <DollarSignIcon />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InputGroupText>USD</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
});

/**
 * Input group with a search button.
 */
export const WithSearchButton = meta.story({
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupInput placeholder="Enter URL" />
      <InputGroupAddon align="inline-start">
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InputGroupButton>Search</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
});

/**
 * Input group with a password visibility toggle.
 */
export const WithPasswordToggle = meta.story({
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupInput placeholder="Enter password" type="password" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton variant="ghost" size="icon-xs" title="Show password">
          <EyeIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
});

/**
 * Input group with a keyboard shortcut indicator.
 */
export const WithKeyboardShortcut = meta.story({
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupInput placeholder="Search commands..." />
      <InputGroupAddon align="inline-start">
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <Kbd>⌘K</Kbd>
      </InputGroupAddon>
    </InputGroup>
  ),
});

/**
 * Input group with a dropdown for filtering.
 */
export const WithDropdown = meta.story({
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon align="inline-start">
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <Select defaultValue="all">
          <SelectTrigger
            aria-label="Search scope"
            className="h-6 gap-1 rounded-sm border-0 bg-transparent px-1.5
              shadow-none focus-visible:ring-0"
          >
            <GlobeIcon className="size-3.5" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="docs">Docs</SelectItem>
            <SelectItem value="code">Code</SelectItem>
            <SelectItem value="issues">Issues</SelectItem>
          </SelectContent>
        </Select>
      </InputGroupAddon>
    </InputGroup>
  ),
});

/**
 * Input group with a loading state.
 */
export const WithSpinner = meta.story({
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupInput placeholder="Saving..." disabled />
      <InputGroupAddon align="inline-end">
        <Spinner />
        <InputGroupText>Saving...</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
});

/**
 * Textarea with a character counter.
 */
export const TextareaWithCharacterCounter = meta.story({
  render: function Render(args) {
    const [value, setValue] = useState("");
    const maxLength = 280;
    const remaining = maxLength - value.length;

    return (
      <InputGroup {...args}>
        <InputGroupTextarea
          placeholder="What's happening?"
          rows={4}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={maxLength}
        />
        <InputGroupAddon align="block-end" className="border-t">
          <InputGroupText
            className={remaining < 20 ? "text-destructive" : undefined}
          >
            {remaining} characters left
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    );
  },
});

/**
 * Textarea with a footer containing actions.
 */
export const TextareaWithFooter = meta.story({
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupTextarea placeholder="Write a comment..." rows={3} />
      <InputGroupAddon align="block-end" className="border-t">
        <AtSignIcon />
        <InputGroupText>Mention someone</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
});

/**
 * Input group with a block-start (top) addon.
 */
export const WithBlockStartAddon = meta.story({
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupInput placeholder="Enter value" />
      <InputGroupAddon align="block-start" className="border-b">
        <InputGroupText>Label</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
});

/**
 * Custom input with the data-slot attribute for focus handling.
 * Use `data-slot="input-group-control"` on custom or third-party inputs.
 */
export const WithCustomInput = meta.story({
  render: (args) => (
    <InputGroup {...args}>
      <input
        data-slot="input-group-control"
        type="text"
        placeholder="Custom input..."
        className="placeholder:text-muted-foreground flex-1 border-0
          bg-transparent px-3 py-2 text-sm outline-none"
      />
      <InputGroupAddon align="inline-start">
        <SearchIcon />
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

/**
 * When typing in input with addon, should update value.
 */

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
  async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("type in input and verify value", async () => {
      const input = canvas.getByPlaceholderText("example.com");

      await userEvent.type(input, "mysite.com");

      await expect(input).toHaveValue("mysite.com");
    });
  }
);

/**
 * Clicking on an addon should focus the input.
 */
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
  async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("click addon and verify input is focused", async () => {
      const addon = canvas.getByTestId("addon");
      const input = canvas.getByPlaceholderText("Search...");

      await userEvent.click(addon);

      await expect(input).toHaveFocus();
    });
  }
);

/**
 * Button inside addon should be clickable.
 */
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
  async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("verify button is clickable", async () => {
      const button = canvas.getByTestId("search-button");

      await expect(button).toBeEnabled();
      await userEvent.click(button);
    });
  }
);

/**
 * When input is disabled, should not accept input.
 */
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
  async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

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
