import preview from "@/storybook/preview";
import { LogOut, Plus, Settings, User } from "lucide-react";
import { expect, userEvent, within } from "storybook/test";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu/dropdown-menu";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "./avatar";

/**
 * An image element with a fallback for representing the user.
 */
const meta = preview.meta({
  title: "ui/Avatar",
  component: Avatar,
  argTypes: {
    size: {
      options: ["default", "sm", "lg"],
      control: { type: "radio" },
    },
  },
  args: {
    size: "default",
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
  parameters: {
    docs: {
      description: {
        component:
          "An image element with a fallback for representing the user.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/avatar)",
      },
    },
    layout: "centered",
  },
});

// --- Stories ---

/**
 * The default form of the avatar.
 */
export const Default = meta.story();

/**
 * An avatar with a badge indicator to show status or notifications.
 */
export const Badge = meta.story({
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
      <AvatarBadge />
    </Avatar>
  ),
});

/**
 * An avatar with an icon inside the badge for additional context.
 */
export const BadgeWithIcon = meta.story({
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
      <AvatarBadge>
        <Plus />
      </AvatarBadge>
    </Avatar>
  ),
});

/**
 * Multiple avatars grouped together with overlapping edges.
 */
export const AvatarGroupStory = meta.story({
  name: "AvatarGroup",
  render: (args) => (
    <AvatarGroup>
      <Avatar {...args}>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/leerob.png" />
        <AvatarFallback>LR</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/evilrabbit.png" />
        <AvatarFallback>ER</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  ),
});

/**
 * An avatar group with a count indicator showing additional avatars.
 */
export const AvatarGroupCountStory = meta.story({
  name: "AvatarGroupCount",
  render: (args) => (
    <AvatarGroup>
      <Avatar {...args}>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/leerob.png" />
        <AvatarFallback>LR</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/evilrabbit.png" />
        <AvatarFallback>ER</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+5</AvatarGroupCount>
    </AvatarGroup>
  ),
});

/**
 * An avatar group with an icon in the count display for actions.
 */
export const AvatarGroupCountIcon = meta.story({
  render: (args) => (
    <AvatarGroup>
      <Avatar {...args}>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/leerob.png" />
        <AvatarFallback>LR</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/evilrabbit.png" />
        <AvatarFallback>ER</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>
        <Plus />
      </AvatarGroupCount>
    </AvatarGroup>
  ),
});

/**
 * Use the `size` prop to change the size of the avatar.
 */
export const Size = meta.story({
  render: (args) => (
    <div className="flex items-center gap-4">
      <Avatar {...args} size="sm">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  ),
});

/**
 * An avatar used as a trigger for a dropdown menu, commonly used for user
 * account menus.
 */
export const Dropdown = meta.story({
  render: (args) => (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="cursor-pointer rounded-full"
        aria-label="User menu"
      >
        <Avatar {...args}>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>
            <User />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
});

// --- Tests ---

Dropdown.test(
  "when clicking the avatar, should open the dropdown menu",
  async ({ canvasElement }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);
    const trigger = await canvasBody.findByRole("button");

    await userEvent.click(trigger);

    const menu = await canvasBody.findByRole("menu");
    await expect(menu).toBeInTheDocument();

    const profileItem = await canvasBody.findByRole("menuitem", {
      name: /profile/i,
    });
    await expect(profileItem).toBeInTheDocument();
  }
);
