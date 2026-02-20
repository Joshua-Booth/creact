import preview from "@/storybook/preview";
import {
  ArrowUpIcon,
  ArrowUpRightIcon,
  CircleFadingArrowUpIcon,
  GitBranchIcon,
} from "lucide-react";
import { expect, fn, userEvent } from "storybook/test";

import { Spinner } from "../spinner";
import { Button } from "./button";

/**
 * Displays a button or a component that looks like a button.
 */
const meta = preview.meta({
  title: "ui/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
      if: { arg: "variant", neq: "link" },
    },
    children: {
      control: "text",
    },
    disabled: {
      control: "boolean",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Displays a button or a component that looks like a button. See also [ButtonGroup](?path=/docs/ui-buttongroup--docs) for grouping related buttons.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/button)",
      },
    },
  },
  args: {
    variant: "default",
    size: "default",
    children: "Button",
    disabled: false,
    onClick: fn(),
  },
});

// --- Stories ---

/**
 * The default form of the button, used for primary actions and commands.
 */
export const Default = meta.story();

/**
 * Use the `size` prop to change the size of the button.
 */
export const Size = meta.story({
  render: (args) => (
    <div className="flex flex-col items-start gap-8 sm:flex-row">
      <div className="flex items-start gap-2">
        <Button {...args} size="xs" variant="outline">
          Extra Small
        </Button>
        <Button {...args} size="icon-xs" variant="outline" aria-label="Submit">
          <ArrowUpRightIcon />
        </Button>
      </div>
      <div className="flex items-start gap-2">
        <Button {...args} size="sm" variant="outline">
          Small
        </Button>
        <Button {...args} size="icon-sm" variant="outline" aria-label="Submit">
          <ArrowUpRightIcon />
        </Button>
      </div>
      <div className="flex items-start gap-2">
        <Button {...args} variant="outline">
          Default
        </Button>
        <Button {...args} size="icon" variant="outline" aria-label="Submit">
          <ArrowUpRightIcon />
        </Button>
      </div>
      <div className="flex items-start gap-2">
        <Button {...args} size="lg" variant="outline">
          Large
        </Button>
        <Button {...args} size="icon-lg" variant="outline" aria-label="Submit">
          <ArrowUpRightIcon />
        </Button>
      </div>
    </div>
  ),
});

/**
 * Use the `outline` button to reduce emphasis on secondary actions, such as
 * canceling or dismissing a dialog.
 */
export const Outline = meta.story({
  args: {
    variant: "outline",
  },
});

/**
 * Use the `secondary` button to call for less emphasized actions, styled to
 * complement the primary button while being less conspicuous.
 */
export const Secondary = meta.story({
  args: {
    variant: "secondary",
  },
});

/**
 * Use the `ghost` button for minimalistic and subtle, less intrusive actions.
 */
export const Ghost = meta.story({
  args: {
    variant: "ghost",
  },
});

/**
 * Use the `destructive` button to indicate errors, alerts, or the need for
 * immediate attention.
 */
export const Destructive = meta.story({
  args: {
    variant: "destructive",
  },
});

/**
 * Use the `link` button to reduce emphasis on tertiary actions, such as
 * hyperlink or navigation, providing a text-only interactive element.
 */
export const Link = meta.story({
  args: {
    variant: "link",
  },
});

/**
 * Use the `icon` size for a button with only an icon.
 */
export const Icon = meta.story({
  render: (args) => (
    <Button {...args} variant="outline" size="icon" aria-label="Upload">
      <CircleFadingArrowUpIcon />
    </Button>
  ),
});

/**
 * Add an icon element to a button to enhance visual communication and
 * provide additional context for the action.
 */
export const WithIcon = meta.story({
  render: (args) => (
    <Button {...args} variant="outline" size="sm">
      <GitBranchIcon /> New Branch
    </Button>
  ),
});

/**
 * Use `className="rounded-full"` to create a pill-shaped button.
 */
export const Rounded = meta.story({
  render: (args) => (
    <Button
      {...args}
      variant="outline"
      size="icon"
      className="rounded-full"
      aria-label="Scroll to top"
    >
      <ArrowUpIcon />
    </Button>
  ),
});

/**
 * Render a `<Spinner />` component inside the button to show a loading state.
 * Add the `disabled` prop to prevent interactions while loading.
 */
export const SpinnerStory = meta.story({
  name: "Spinner",
  render: (args) => (
    <Button {...args} size="sm" variant="outline" disabled>
      <Spinner />
      Submit
    </Button>
  ),
});

/**
 * Use the `render` prop to render the button as another element, such as an
 * anchor tag. Set `nativeButton` to `false` for non-button elements.
 */
export const Render = meta.story({
  render: (args) => (
    <Button
      {...args}
      render={<a href="#login" aria-label="Login" />}
      nativeButton={false}
    >
      Login
    </Button>
  ),
});

// --- Tests ---

Default.test(
  "when clicking the button, should trigger onClick",
  async ({ args, canvas, step }) => {
    const button = await canvas.findByRole("button");

    await step("click the button", async () => {
      await userEvent.click(button);
      await expect(args.onClick).toHaveBeenCalledTimes(1);
    });

    await step("click the button again", async () => {
      await userEvent.click(button);
      await expect(args.onClick).toHaveBeenCalledTimes(2);
    });
  }
);

SpinnerStory.test(
  "when button is disabled, should not trigger onClick",
  async ({ args, canvas }) => {
    const button = await canvas.findByRole("button");
    await expect(button).toBeDisabled();
    await userEvent.click(button, { pointerEventsCheck: 0 });
    await expect(args.onClick).not.toHaveBeenCalled();
  }
);
