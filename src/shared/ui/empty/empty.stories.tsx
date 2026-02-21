import preview from "@/storybook/preview";
import {
  ArrowUpRightIcon,
  BellIcon,
  CloudIcon,
  FolderCodeIcon,
  PlusIcon,
  RefreshCcwIcon,
  SearchIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Button } from "../button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../input-group";
import { Kbd } from "../kbd";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./empty";

/**
 * Displays an empty state with customizable icon, title, description, and actions.
 */
const meta = preview.meta({
  title: "ui/Empty",
  component: Empty,
  args: {},
  parameters: {
    docs: {
      description: {
        component:
          "Displays an empty state with customizable icon, title, description, and actions.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/empty)",
      },
    },
  },
});

// --- Stories ---

/**
 * The default empty state with icon, title, description, two buttons, and a link.
 */
export const Default = meta.story({
  render: (args) => (
    <Empty {...args}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderCodeIcon />
        </EmptyMedia>
        <EmptyTitle>No Projects Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any projects yet. Get started by creating
          your first project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button>Create Project</Button>
          <Button variant="outline">Import Project</Button>
        </div>
      </EmptyContent>
      <button
        type="button"
        className="text-muted-foreground inline-flex items-center gap-1 text-sm
          underline-offset-4 hover:underline"
      >
        Learn More <ArrowUpRightIcon className="size-3" />
      </button>
    </Empty>
  ),
});

/**
 * Empty state with a dashed border outline.
 */
export const Outline = meta.story({
  render: (args) => (
    <Empty {...args} className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CloudIcon />
        </EmptyMedia>
        <EmptyTitle>Cloud Storage Empty</EmptyTitle>
        <EmptyDescription>
          Upload files to your cloud storage to access them anywhere.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm">
          Upload Files
        </Button>
      </EmptyContent>
    </Empty>
  ),
});

/**
 * Empty state with a muted background.
 */
export const Muted = meta.story({
  render: (args) => (
    <Empty {...args} className="bg-muted/30 h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BellIcon />
        </EmptyMedia>
        <EmptyTitle>No Notifications</EmptyTitle>
        <EmptyDescription>
          You&apos;re all caught up. New notifications will appear here.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm">
          <RefreshCcwIcon />
          Refresh
        </Button>
      </EmptyContent>
    </Empty>
  ),
});

/**
 * Empty state with a single avatar in the media slot.
 */
export const AvatarStory = meta.story({
  name: "Avatar",
  render: (args) => (
    <Empty {...args}>
      <EmptyHeader>
        <EmptyMedia variant="default">
          <Avatar className="size-12">
            <AvatarImage
              src="https://github.com/shadcn.png"
              className="grayscale"
            />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
        </EmptyMedia>
        <EmptyTitle>User Offline</EmptyTitle>
        <EmptyDescription>
          This user is currently offline. You can leave a message to notify them
          or try again later.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">Leave Message</Button>
      </EmptyContent>
    </Empty>
  ),
});

/**
 * Empty state with multiple avatars in a group.
 */
export const AvatarGroup = meta.story({
  render: (args) => (
    <Empty {...args}>
      <EmptyHeader>
        <EmptyMedia>
          <div
            className="*:data-[slot=avatar]:ring-background flex -space-x-2
              *:data-[slot=avatar]:size-12 *:data-[slot=avatar]:ring-2
              *:data-[slot=avatar]:grayscale"
          >
            <Avatar>
              <AvatarImage src="/avatars/01.png" alt="User 1" />
              <AvatarFallback>U1</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="/avatars/02.png" alt="User 2" />
              <AvatarFallback>U2</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="/avatars/03.png" alt="User 3" />
              <AvatarFallback>U3</AvatarFallback>
            </Avatar>
          </div>
        </EmptyMedia>
        <EmptyTitle>No Team Members</EmptyTitle>
        <EmptyDescription>
          Invite your team to collaborate on this project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">
          <PlusIcon />
          Invite Members
        </Button>
      </EmptyContent>
    </Empty>
  ),
});

/**
 * Empty state with an input group for searching (404 page pattern).
 */
export const InputGroupStory = meta.story({
  name: "Input Group",
  render: (args) => (
    <Empty {...args}>
      <EmptyHeader>
        <EmptyTitle>404 - Not Found</EmptyTitle>
        <EmptyDescription>
          The page you&apos;re looking for does not exist. Try searching for
          what you need below.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <InputGroup className="sm:w-3/4">
          <InputGroupInput placeholder="Try searching for pages..." />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Kbd>/</Kbd>
          </InputGroupAddon>
        </InputGroup>
        <EmptyDescription>
          Need help?{" "}
          <button type="button" className="underline underline-offset-4">
            Contact support
          </button>
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  ),
});
