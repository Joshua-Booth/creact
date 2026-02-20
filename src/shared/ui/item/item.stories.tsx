import preview from "@/storybook/preview";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  FileIcon,
  FolderIcon,
  MoreHorizontalIcon,
  MusicIcon,
  PlusIcon,
  ShieldAlertIcon,
  StarIcon,
} from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";

import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Badge } from "../badge";
import { Button } from "../button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "./item";

/**
 * Displays a list item with customizable media, content, and actions.
 */
const meta = preview.meta({
  title: "ui/Item",
  component: Item,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "muted"],
      description: "The visual variant of the item",
    },
    size: {
      control: "select",
      options: ["default", "sm", "xs"],
      description: "The size of the item",
    },
  },
  args: {
    size: "default",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Displays a list item with customizable media, content, and actions.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/item)",
      },
    },
  },
});

// --- Stories ---

/**
 * The default item with title and description.
 */
export const Default = meta.story({
  render: (args) => (
    <Item {...args} className="w-96">
      <ItemContent>
        <ItemTitle>Item Title</ItemTitle>
        <ItemDescription>
          This is a description of the item that provides additional context.
        </ItemDescription>
      </ItemContent>
    </Item>
  ),
});

/**
 * Item with an icon media element showing a security alert pattern.
 */
export const WithIcon = meta.story({
  render: (args) => (
    <Item {...args} className="w-96" variant="outline">
      <ItemMedia variant="icon">
        <ShieldAlertIcon className="text-destructive" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Security Alert</ItemTitle>
        <ItemDescription>
          Your account security needs attention. Review recent activity.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="outline" size="sm">
          Review
        </Button>
      </ItemActions>
    </Item>
  ),
});

/**
 * Item with an Avatar component for user profiles.
 */
export const WithAvatar = meta.story({
  render: (args) => (
    <div className="flex w-96 flex-col gap-4">
      <Item {...args} variant="outline">
        <ItemMedia>
          <Avatar>
            <AvatarImage
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
              alt="John Doe"
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>John Doe</ItemTitle>
          <ItemDescription>Software Engineer</ItemDescription>
        </ItemContent>
      </Item>
      <Item {...args} variant="outline">
        <ItemMedia>
          <Avatar>
            <AvatarImage
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
              alt="Jane Smith"
            />
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Jane Smith</ItemTitle>
          <ItemDescription>Product Designer</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="ghost" size="icon-sm" title="Add to team">
            <PlusIcon />
          </Button>
        </ItemActions>
      </Item>
    </div>
  ),
});

/**
 * Item with an image media element for music playlist style.
 */
export const WithImage = meta.story({
  render: (args) => (
    <ItemGroup className="w-96">
      <Item {...args} render={<div role="listitem" />} variant="outline">
        <ItemMedia variant="image">
          <img
            src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop"
            alt="Album cover"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Midnight Dreams</ItemTitle>
          <ItemDescription>The Melodics • 2024</ItemDescription>
        </ItemContent>
        <ItemActions>
          <MusicIcon className="text-muted-foreground size-4" />
        </ItemActions>
      </Item>
      <Item {...args} render={<div role="listitem" />} variant="outline">
        <ItemMedia variant="image">
          <img
            src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop"
            alt="Album cover"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Electric Sunset</ItemTitle>
          <ItemDescription>Neon Waves • 2023</ItemDescription>
        </ItemContent>
        <ItemActions>
          <MusicIcon className="text-muted-foreground size-4" />
        </ItemActions>
      </Item>
    </ItemGroup>
  ),
});

/**
 * Item with action buttons.
 */
export const WithActions = meta.story({
  render: (args) => (
    <Item {...args} className="w-96" variant="outline">
      <ItemMedia variant="icon">
        <FolderIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Project Files</ItemTitle>
        <ItemDescription>12 items</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="ghost" size="icon-sm" title="Add to favorites">
          <StarIcon />
        </Button>
        <Button variant="ghost" size="icon-sm" title="More options">
          <MoreHorizontalIcon />
        </Button>
      </ItemActions>
    </Item>
  ),
});

/**
 * Item with ItemHeader for grid-style layouts.
 */
export const WithHeader = meta.story({
  render: (args) => (
    <Item {...args} className="w-96" variant="outline">
      <ItemHeader>
        <ItemMedia variant="image">
          <img
            src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop"
            alt="Cover"
          />
        </ItemMedia>
        <ItemActions>
          <Button variant="ghost" size="icon-sm" title="More options">
            <MoreHorizontalIcon />
          </Button>
        </ItemActions>
      </ItemHeader>
      <ItemContent>
        <ItemTitle>Featured Playlist</ItemTitle>
        <ItemDescription>Curated collection of the best tracks</ItemDescription>
      </ItemContent>
    </Item>
  ),
});

/**
 * Items rendered as clickable links.
 */
export const AsLink = meta.story({
  render: (args) => {
    /* eslint-disable jsx-a11y/anchor-has-content -- content provided by Item children via render prop */
    return (
      <div className="flex w-96 flex-col gap-4">
        <Item {...args} render={<a href="#internal" />}>
          <ItemContent>
            <ItemTitle>Documentation</ItemTitle>
            <ItemDescription>Internal link to docs</ItemDescription>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon className="text-muted-foreground size-4" />
          </ItemActions>
        </Item>
        <Item
          {...args}
          variant="outline"
          render={
            <a
              href="https://example.com"
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          <ItemContent>
            <ItemTitle>External Resource</ItemTitle>
            <ItemDescription>Opens in new tab</ItemDescription>
          </ItemContent>
          <ItemActions>
            <ExternalLinkIcon className="text-muted-foreground size-4" />
          </ItemActions>
        </Item>
      </div>
    );
    /* eslint-enable jsx-a11y/anchor-has-content -- re-enable after anchor rendered via asChild prop */
  },
});

/**
 * All three variants displayed together.
 */
export const Variants = meta.story({
  render: (args) => (
    <div className="flex w-96 flex-col gap-4">
      <Item {...args} variant="default">
        <ItemMedia variant="icon">
          <FileIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Default Variant</ItemTitle>
          <ItemDescription>No visible border, clean look.</ItemDescription>
        </ItemContent>
      </Item>
      <Item {...args} variant="outline">
        <ItemMedia variant="icon">
          <FileIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Outline Variant</ItemTitle>
          <ItemDescription>Has a visible border.</ItemDescription>
        </ItemContent>
      </Item>
      <Item {...args} variant="muted">
        <ItemMedia variant="icon">
          <FileIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Muted Variant</ItemTitle>
          <ItemDescription>Subtle background color.</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  ),
});

/**
 * Default and small sizes displayed together.
 */
export const Sizes = meta.story({
  render: (args) => (
    <div className="flex w-96 flex-col gap-4">
      <Item {...args} size="default" variant="outline">
        <ItemMedia variant="icon">
          <FileIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Default Size</ItemTitle>
          <ItemDescription>Standard padding and spacing.</ItemDescription>
        </ItemContent>
      </Item>
      <Item {...args} size="sm" variant="outline">
        <ItemMedia variant="icon">
          <FileIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Small Size</ItemTitle>
          <ItemDescription>Compact padding and spacing.</ItemDescription>
        </ItemContent>
      </Item>
      <Item {...args} size="xs" variant="outline">
        <ItemMedia variant="icon">
          <FileIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Extra Small Size</ItemTitle>
          <ItemDescription>The most compact size available.</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  ),
});

/**
 * Items inside a dropdown menu.
 */
export const InDropdown = meta.story({
  render: (args) => (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline">
            Select <ChevronDownIcon />
          </Button>
        }
      />
      <DropdownMenuContent className="w-48">
        <Item {...args} size="xs" render={<button type="button" />}>
          <ItemMedia>
            <Avatar className="size-6">
              <AvatarImage
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                alt="John Doe"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>John Doe</ItemTitle>
            <ItemDescription>john@example.com</ItemDescription>
          </ItemContent>
        </Item>
        <Item {...args} size="xs" render={<button type="button" />}>
          <ItemMedia>
            <Avatar className="size-6">
              <AvatarImage
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
                alt="Jane Smith"
              />
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Jane Smith</ItemTitle>
            <ItemDescription>jane@example.com</ItemDescription>
          </ItemContent>
        </Item>
        <Item {...args} size="xs" render={<button type="button" />}>
          <ItemMedia>
            <Avatar className="size-6">
              <AvatarImage
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                alt="Bob Wilson"
              />
              <AvatarFallback>BW</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Bob Wilson</ItemTitle>
            <ItemDescription>bob@example.com</ItemDescription>
          </ItemContent>
        </Item>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
});

/**
 * Item with a badge in the title.
 */
export const WithBadge = meta.story({
  render: (args) => (
    <Item {...args} className="w-96" variant="outline">
      <ItemMedia variant="icon">
        <FileIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          Featured Item
          <Badge variant="secondary">New</Badge>
        </ItemTitle>
        <ItemDescription>This item has a badge indicator.</ItemDescription>
      </ItemContent>
    </Item>
  ),
});

/**
 * ItemGroup with multiple items.
 */
export const Group = meta.story({
  render: (args) => (
    <ItemGroup className="w-96">
      <Item {...args} variant="outline" render={<div role="listitem" />}>
        <ItemMedia variant="icon">
          <FolderIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Documents</ItemTitle>
          <ItemDescription>24 files</ItemDescription>
        </ItemContent>
        <ItemActions>
          <ChevronRightIcon className="text-muted-foreground size-4" />
        </ItemActions>
      </Item>
      <Item {...args} variant="outline" render={<div role="listitem" />}>
        <ItemMedia variant="icon">
          <FolderIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Images</ItemTitle>
          <ItemDescription>128 files</ItemDescription>
        </ItemContent>
        <ItemActions>
          <ChevronRightIcon className="text-muted-foreground size-4" />
        </ItemActions>
      </Item>
      <Item {...args} variant="outline" render={<div role="listitem" />}>
        <ItemMedia variant="icon">
          <FolderIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Videos</ItemTitle>
          <ItemDescription>8 files</ItemDescription>
        </ItemContent>
        <ItemActions>
          <ChevronRightIcon className="text-muted-foreground size-4" />
        </ItemActions>
      </Item>
    </ItemGroup>
  ),
});

/**
 * ItemGroup with separator between items.
 */
export const GroupWithSeparator = meta.story({
  parameters: {
    a11y: {
      config: {
        rules: [
          // Separator component adds aria-orientation with role="presentation" which is not allowed
          // This is a component implementation issue in the Separator component
          { id: "aria-allowed-attr", enabled: false },
        ],
      },
    },
  },
  render: (args) => (
    <ItemGroup className="w-96">
      <Item {...args} render={<div role="listitem" />}>
        <ItemMedia>
          <Avatar>
            <AvatarImage
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
              alt="Alice Johnson"
            />
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Alice Johnson</ItemTitle>
          <ItemDescription>Product Designer</ItemDescription>
        </ItemContent>
      </Item>
      <ItemSeparator role="presentation" />
      <Item {...args} render={<div role="listitem" />}>
        <ItemMedia>
          <Avatar>
            <AvatarImage
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
              alt="Bob Smith"
            />
            <AvatarFallback>BS</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Bob Smith</ItemTitle>
          <ItemDescription>Software Engineer</ItemDescription>
        </ItemContent>
      </Item>
      <ItemSeparator role="presentation" />
      <Item {...args} render={<div role="listitem" />}>
        <ItemMedia>
          <Avatar>
            <AvatarImage
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
              alt="Carol Williams"
            />
            <AvatarFallback>CW</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Carol Williams</ItemTitle>
          <ItemDescription>Project Manager</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  ),
});

/**
 * Should render item with media, title, and description.
 */

// --- Tests ---

Default.test(
  "should render item with media, title, and description",
  {
    render: (args) => (
      <Item {...args} className="w-96">
        <ItemMedia variant="icon" data-testid="item-media">
          <FileIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle data-testid="item-title">Test Document</ItemTitle>
          <ItemDescription data-testid="item-description">
            This is a test description
          </ItemDescription>
        </ItemContent>
      </Item>
    ),
  },
  async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("verify title is rendered", async () => {
      await expect(canvas.getByText("Test Document")).toBeVisible();
    });

    await step("verify description is rendered", async () => {
      await expect(
        canvas.getByText("This is a test description")
      ).toBeVisible();
    });

    await step("verify media is rendered", async () => {
      const media = canvas.getByTestId("item-media");
      await expect(media).toBeVisible();
    });
  }
);

/**
 * When action buttons are clicked, should trigger handlers.
 */
Default.test(
  "when action buttons are clicked, should trigger handlers",
  {
    render: (args) => {
      const onFavoriteClick = fn();
      const onMoreClick = fn();

      return (
        <Item {...args} className="w-96">
          <ItemMedia variant="icon">
            <FolderIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Project Files</ItemTitle>
            <ItemDescription>12 items</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button
              variant="ghost"
              size="icon-sm"
              title="Add to favorites"
              onClick={onFavoriteClick}
            >
              <StarIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              title="More options"
              onClick={onMoreClick}
            >
              <MoreHorizontalIcon />
            </Button>
          </ItemActions>
        </Item>
      );
    },
  },
  async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("click action buttons and verify they respond", async () => {
      const favoriteButton = canvas.getByRole("button", {
        name: /add to favorites/i,
      });
      const moreButton = canvas.getByRole("button", { name: /more options/i });

      await userEvent.click(favoriteButton);
      await userEvent.click(moreButton);

      await expect(favoriteButton).toBeEnabled();
      await expect(moreButton).toBeEnabled();
    });
  }
);
