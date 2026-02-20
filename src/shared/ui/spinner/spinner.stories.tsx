import preview from "@/storybook/preview";
import { ArrowUpIcon, LoaderIcon } from "lucide-react";
import { expect } from "storybook/test";

import { Badge } from "../badge";
import { Button } from "../button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "../input-group";
import { Spinner } from "./spinner";

/**
 * Displays a loading spinner to indicate ongoing processes.
 */
const meta = preview.meta({
  title: "ui/Spinner",
  component: Spinner,
  argTypes: {
    className: {
      control: "text",
      description: "Additional CSS classes for sizing and styling",
    },
  },
  args: {},
  parameters: {
    docs: {
      description: {
        component:
          "Displays a loading spinner to indicate ongoing processes.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/spinner)",
      },
    },
  },
});

// --- Stories ---

/**
 * The default spinner size (16px / size-4).
 */
export const Default = meta.story();

/**
 * Replace the default spinner icon with any other icon.
 */
export const Custom = meta.story({
  render: (args) => (
    <div className="flex items-center gap-4">
      <LoaderIcon
        {...args}
        role="status"
        aria-label="Loading"
        className="size-4 animate-spin"
      />
    </div>
  ),
});

/**
 * Size variants displayed together for comparison.
 */
export const Size = meta.story({
  render: (args) => (
    <div className="flex items-end gap-4">
      <Spinner {...args} className="size-3" />
      <Spinner {...args} className="size-4" />
      <Spinner {...args} className="size-6" />
      <Spinner {...args} className="size-8" />
    </div>
  ),
});

/**
 * Spinners in buttons using the data-icon pattern.
 */
export const ButtonStory = meta.story({
  name: "Button",
  render: (args) => (
    <div className="flex gap-4">
      <Button disabled>
        <Spinner {...args} data-icon="inline-start" />
        Loading...
      </Button>
      <Button variant="outline" disabled>
        <Spinner {...args} data-icon="inline-start" />
        Processing
      </Button>
      <Button variant="secondary" disabled>
        <Spinner {...args} data-icon="inline-start" />
        Please wait
      </Button>
    </div>
  ),
});

/**
 * Spinners in badges using the data-icon pattern.
 */
export const BadgeStory = meta.story({
  name: "Badge",
  render: (args) => (
    <div className="flex gap-4">
      <Badge>
        <Spinner {...args} data-icon="inline-start" />
        Loading
      </Badge>
      <Badge variant="secondary">
        <Spinner {...args} data-icon="inline-start" />
        Processing
      </Badge>
      <Badge variant="outline">
        <Spinner {...args} data-icon="inline-start" />
        Syncing
      </Badge>
    </div>
  ),
});

/**
 * Spinners in input groups for loading states.
 */
export const InputGroupStory = meta.story({
  name: "InputGroup",
  render: (args) => (
    <div className="flex w-80 flex-col gap-4">
      <InputGroup>
        <InputGroupInput placeholder="Send a message..." disabled />
        <InputGroupAddon align="inline-end">
          <Spinner {...args} />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupTextarea placeholder="Send a message..." disabled />
        <InputGroupAddon align="block-end">
          <Spinner {...args} /> Validating...
          <InputGroupButton className="ml-auto" variant="default" disabled>
            <ArrowUpIcon />
            <span className="sr-only">Send</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
});

/**
 * Spinner in an empty state component for loading.
 */
export const EmptyStory = meta.story({
  name: "Empty",
  render: (args) => (
    <Empty className="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner {...args} />
        </EmptyMedia>
        <EmptyTitle>Processing your request</EmptyTitle>
        <EmptyDescription>
          Please wait while we process your request. Do not refresh the page.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm">
          Cancel
        </Button>
      </EmptyContent>
    </Empty>
  ),
});

// --- Tests ---

Default.test("should have accessible loading role", async ({ canvas }) => {
  const spinner = await canvas.findByRole("status");
  await expect(spinner).toHaveAccessibleName("Loading");
});
