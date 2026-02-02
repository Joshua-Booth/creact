import type { Meta, StoryObj } from "@storybook/react-vite";

import { ArrowUpIcon } from "lucide-react";

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
const meta = {
  title: "ui/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
      description: "Additional CSS classes for sizing and styling",
    },
  },
  args: {},
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default spinner size (16px / size-4).
 */
export const Default: Story = {};

/**
 * Size variants displayed together for comparison.
 */
export const Size: Story = {
  render: (args) => (
    <div className="flex items-end gap-4">
      <Spinner {...args} className="size-3" />
      <Spinner {...args} className="size-4" />
      <Spinner {...args} className="size-6" />
      <Spinner {...args} className="size-8" />
    </div>
  ),
};

/**
 * Spinners in buttons using the data-icon pattern.
 */
export const ButtonStory: Story = {
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
};

/**
 * Spinners in badges using the data-icon pattern.
 */
export const BadgeStory: Story = {
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
};

/**
 * Spinners in input groups for loading states.
 */
export const InputGroupStory: Story = {
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
};

/**
 * Spinner in an empty state component for loading.
 */
export const EmptyStory: Story = {
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
};
