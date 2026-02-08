/* eslint-disable @typescript-eslint/no-non-null-assertion -- Test assertions on known DOM elements */
import { useState } from "react";

import preview from "@/storybook/preview";
import {
  Clipboard,
  Copy,
  CreditCard,
  LogOut,
  Scissors,
  Settings,
  Trash,
  User,
} from "lucide-react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "./context-menu";

/**
 * Displays a menu to the user — such as a set of actions or functions —
 * triggered by right-clicking.
 */
const meta = preview.meta({
  title: "ui/ContextMenu",
  component: ContextMenu,
  argTypes: {},
  args: {},
  render: (args) => (
    <ContextMenu {...args}>
      <ContextMenuTrigger
        className="bg-accent flex h-48 w-96 items-center justify-center
          rounded-md border border-dashed text-sm"
      >
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-44">
        <ContextMenuItem>
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem disabled>
          Forward
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Reload
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
  parameters: {
    layout: "centered",
  },
});

// --- Stories ---

/**
 * A basic context menu with navigation actions.
 */
export const Basic = meta.story();

/**
 * A context menu with nested submenus.
 */
export const Submenu = meta.story({
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: "aria-required-children", enabled: false },
          { id: "aria-hidden-focus", enabled: false },
        ],
      },
    },
  },
  render: (args) => (
    <ContextMenu {...args}>
      <ContextMenuTrigger
        className="bg-accent flex h-48 w-96 items-center justify-center
          rounded-md border border-dashed text-sm"
      >
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-44">
        <ContextMenuItem>
          <Copy />
          Copy
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <Scissors />
          Cut
          <ContextMenuShortcut>⌘X</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <Clipboard />
          Paste
          <ContextMenuShortcut>⌘V</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>
              Save Page As...
              <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>Create Shortcut...</ContextMenuItem>
            <ContextMenuItem>Name Window...</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Developer Tools</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  ),
});

/**
 * A context menu with keyboard shortcuts.
 */
export const Shortcuts = meta.story({
  render: (args) => (
    <ContextMenu {...args}>
      <ContextMenuTrigger
        className="bg-accent flex h-48 w-96 items-center justify-center
          rounded-md border border-dashed text-sm"
      >
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-44">
        <ContextMenuItem>
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem disabled>
          Forward
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Reload
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          Save Page As...
          <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Print...
          <ContextMenuShortcut>⌘P</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
});

/**
 * A context menu with grouped items using labels and separators.
 */
export const Groups = meta.story({
  render: (args) => (
    <ContextMenu {...args}>
      <ContextMenuTrigger
        className="bg-accent flex h-48 w-96 items-center justify-center
          rounded-md border border-dashed text-sm"
      >
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-44">
        <ContextMenuGroup>
          <ContextMenuLabel>Edit</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <Copy />
            Copy
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <Scissors />
            Cut
            <ContextMenuShortcut>⌘X</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <Clipboard />
            Paste
            <ContextMenuShortcut>⌘V</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuLabel>Account</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <User />
            Profile
          </ContextMenuItem>
          <ContextMenuItem>
            <Settings />
            Settings
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  ),
});

/**
 * A context menu with icons on menu items.
 */
export const Icons = meta.story({
  render: (args) => (
    <ContextMenu {...args}>
      <ContextMenuTrigger
        className="bg-accent flex h-48 w-96 items-center justify-center
          rounded-md border border-dashed text-sm"
      >
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-44">
        <ContextMenuItem>
          <User />
          Profile
          <ContextMenuShortcut>⇧⌘P</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <CreditCard />
          Billing
          <ContextMenuShortcut>⌘B</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <Settings />
          Settings
          <ContextMenuShortcut>⌘S</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <LogOut />
          Log out
          <ContextMenuShortcut>⇧⌘Q</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
});

/**
 * A context menu with checkbox items for toggling options.
 */
export const Checkboxes = meta.story({
  render: function Render(args) {
    const [statusBar, setStatusBar] = useState(true);
    const [activityBar, setActivityBar] = useState(false);
    const [panel, setPanel] = useState(false);

    return (
      <ContextMenu {...args}>
        <ContextMenuTrigger
          className="bg-accent flex h-48 w-96 items-center justify-center
            rounded-md border border-dashed text-sm"
        >
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent className="w-44">
          <ContextMenuGroup>
            <ContextMenuLabel inset>Appearance</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuCheckboxItem
              checked={statusBar}
              onCheckedChange={setStatusBar}
            >
              Status Bar
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              checked={activityBar}
              onCheckedChange={setActivityBar}
            >
              Activity Bar
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem checked={panel} onCheckedChange={setPanel}>
              Panel
            </ContextMenuCheckboxItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
});

/**
 * A context menu with radio items for selecting one option.
 */
export const Radio = meta.story({
  render: function Render(args) {
    const [position, setPosition] = useState("bottom");

    return (
      <ContextMenu {...args}>
        <ContextMenuTrigger
          className="bg-accent flex h-48 w-96 items-center justify-center
            rounded-md border border-dashed text-sm"
        >
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent className="w-32">
          <ContextMenuGroup>
            <ContextMenuLabel inset>Panel Position</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuRadioGroup value={position} onValueChange={setPosition}>
              <ContextMenuRadioItem value="top">Top</ContextMenuRadioItem>
              <ContextMenuRadioItem value="bottom">Bottom</ContextMenuRadioItem>
              <ContextMenuRadioItem value="right">Right</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
});

/**
 * A context menu with a destructive action.
 */
export const Destructive = meta.story({
  render: (args) => (
    <ContextMenu {...args}>
      <ContextMenuTrigger
        className="bg-accent flex h-48 w-96 items-center justify-center
          rounded-md border border-dashed text-sm"
      >
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-44">
        <ContextMenuItem>
          <Copy />
          Copy
        </ContextMenuItem>
        <ContextMenuItem>
          <Clipboard />
          Paste
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          <Trash />
          Delete
          <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
});

/**
 * A context menu with placement control using the side prop.
 */
export const Sides = meta.story({
  render: (args) => (
    <div className="grid w-sm grid-cols-2 gap-4">
      <ContextMenu {...args}>
        <ContextMenuTrigger
          className="flex aspect-video w-full max-w-xs items-center
            justify-center rounded-xl border border-dashed text-sm"
        >
          Right click (top)
        </ContextMenuTrigger>
        <ContextMenuContent side="top">
          <ContextMenuGroup>
            <ContextMenuItem>Back</ContextMenuItem>
            <ContextMenuItem>Forward</ContextMenuItem>
            <ContextMenuItem>Reload</ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
      <ContextMenu>
        <ContextMenuTrigger
          className="flex aspect-video w-full max-w-xs items-center
            justify-center rounded-xl border border-dashed text-sm"
        >
          Right click (right)
        </ContextMenuTrigger>
        <ContextMenuContent side="right">
          <ContextMenuGroup>
            <ContextMenuItem>Back</ContextMenuItem>
            <ContextMenuItem>Forward</ContextMenuItem>
            <ContextMenuItem>Reload</ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
      <ContextMenu>
        <ContextMenuTrigger
          className="flex aspect-video w-full max-w-xs items-center
            justify-center rounded-xl border border-dashed text-sm"
        >
          Right click (bottom)
        </ContextMenuTrigger>
        <ContextMenuContent side="bottom">
          <ContextMenuGroup>
            <ContextMenuItem>Back</ContextMenuItem>
            <ContextMenuItem>Forward</ContextMenuItem>
            <ContextMenuItem>Reload</ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
      <ContextMenu>
        <ContextMenuTrigger
          className="flex aspect-video w-full max-w-xs items-center
            justify-center rounded-xl border border-dashed text-sm"
        >
          Right click (left)
        </ContextMenuTrigger>
        <ContextMenuContent side="left">
          <ContextMenuGroup>
            <ContextMenuItem>Back</ContextMenuItem>
            <ContextMenuItem>Forward</ContextMenuItem>
            <ContextMenuItem>Reload</ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  ),
});

// --- Tests ---

Basic.test(
  "when right-clicking the trigger area, the menu appears and can be interacted with",
  async ({ canvasElement, canvas, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("Right-click on the trigger area", async () => {
      await userEvent.pointer({
        keys: "[MouseRight>]",
        target: await canvas.findByText(/click here/i),
        coords: {
          x: canvasElement.clientWidth / 2,
          y: canvasElement.clientHeight / 2,
        },
      });
    });
    await expect(await canvasBody.findByRole("menu")).toBeInTheDocument();
    const items = await canvasBody.findAllByRole("menuitem");
    await expect(items).toHaveLength(3);

    await step("Click the first menu item", async () => {
      await userEvent.click(items[0]!, { delay: 100 });
    });
  }
);

Basic.test(
  "when the disabled item is present, it cannot be clicked",
  async ({ canvasElement, canvas, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("Right-click to open the menu", async () => {
      await userEvent.pointer({
        keys: "[MouseRight>]",
        target: await canvas.findByText(/click here/i),
        coords: {
          x: canvasElement.clientWidth / 2,
          y: canvasElement.clientHeight / 2,
        },
      });
    });

    await step("Verify the disabled item has correct attributes", async () => {
      const forwardItem = await canvasBody.findByText("Forward");
      const menuItem = forwardItem.closest("[data-slot='context-menu-item']")!;
      await expect(menuItem).toHaveAttribute("data-disabled");
    });
  }
);

Submenu.test(
  "when hovering the sub-trigger, the submenu opens",
  async ({ canvasElement, canvas, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("Right-click to open the menu", async () => {
      await userEvent.pointer({
        keys: "[MouseRight>]",
        target: await canvas.findByText(/click here/i),
        coords: {
          x: canvasElement.clientWidth / 2,
          y: canvasElement.clientHeight / 2,
        },
      });
    });

    await step("Hover on 'More Tools' sub-trigger", async () => {
      const subTrigger = await canvasBody.findByText("More Tools");
      await userEvent.hover(subTrigger);
    });

    await step("Verify the submenu content appears", async () => {
      await expect(
        await canvasBody.findByText("Developer Tools")
      ).toBeInTheDocument();
    });
  }
);

Checkboxes.test(
  "when clicking a checkbox item, its checked state toggles",
  async ({ canvasElement, canvas, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("Right-click to open the menu", async () => {
      await userEvent.pointer({
        keys: "[MouseRight>]",
        target: await canvas.findByText(/click here/i),
        coords: {
          x: canvasElement.clientWidth / 2,
          y: canvasElement.clientHeight / 2,
        },
      });
    });

    await step("Verify Status Bar is initially checked", async () => {
      const statusBar = await canvasBody.findByRole("menuitemcheckbox", {
        name: /status bar/i,
      });
      await expect(statusBar).toHaveAttribute("aria-checked", "true");
    });

    await step("Click Activity Bar to toggle it on", async () => {
      const activityBar = await canvasBody.findByRole("menuitemcheckbox", {
        name: /activity bar/i,
      });
      await expect(activityBar).toHaveAttribute("aria-checked", "false");
      await userEvent.click(activityBar);
    });

    await step("Re-open and verify Activity Bar is now checked", async () => {
      await userEvent.pointer({
        keys: "[MouseRight>]",
        target: await canvas.findByText(/click here/i),
        coords: {
          x: canvasElement.clientWidth / 2,
          y: canvasElement.clientHeight / 2,
        },
      });
      const activityBar = await canvasBody.findByRole("menuitemcheckbox", {
        name: /activity bar/i,
      });
      await expect(activityBar).toHaveAttribute("aria-checked", "true");
    });
  }
);

Radio.test(
  "when clicking a radio item, the selection changes",
  async ({ canvasElement, canvas, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("Right-click to open the menu", async () => {
      await userEvent.pointer({
        keys: "[MouseRight>]",
        target: await canvas.findByText(/click here/i),
        coords: {
          x: canvasElement.clientWidth / 2,
          y: canvasElement.clientHeight / 2,
        },
      });
    });

    await step("Verify Bottom is initially selected", async () => {
      const bottom = await canvasBody.findByRole("menuitemradio", {
        name: /bottom/i,
      });
      await expect(bottom).toHaveAttribute("aria-checked", "true");
    });

    await step("Click Top to change selection", async () => {
      const top = await canvasBody.findByRole("menuitemradio", {
        name: /^top$/i,
      });
      await userEvent.click(top);
    });

    await step("Re-open and verify Top is now selected", async () => {
      await userEvent.pointer({
        keys: "[MouseRight>]",
        target: await canvas.findByText(/click here/i),
        coords: {
          x: canvasElement.clientWidth / 2,
          y: canvasElement.clientHeight / 2,
        },
      });
      const top = await canvasBody.findByRole("menuitemradio", {
        name: /^top$/i,
      });
      await expect(top).toHaveAttribute("aria-checked", "true");
      const bottom = await canvasBody.findByRole("menuitemradio", {
        name: /bottom/i,
      });
      await expect(bottom).toHaveAttribute("aria-checked", "false");
    });
  }
);

Basic.test(
  "when using keyboard navigation, arrow keys move focus through items and escape closes the menu",
  async ({ canvasElement, canvas, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("Right-click to open the menu", async () => {
      await userEvent.pointer({
        keys: "[MouseRight>]",
        target: await canvas.findByText(/click here/i),
        coords: {
          x: canvasElement.clientWidth / 2,
          y: canvasElement.clientHeight / 2,
        },
      });
    });

    const menu = await canvasBody.findByRole("menu");
    const items = await canvasBody.findAllByRole("menuitem");

    await step("Press ArrowDown to move focus to the first item", async () => {
      await userEvent.keyboard("{ArrowDown}");
      await waitFor(() => expect(items[0]).toHaveFocus());
    });

    await step(
      "Press ArrowDown to move focus to the disabled item",
      async () => {
        await userEvent.keyboard("{ArrowDown}");
        await waitFor(() => expect(items[1]).toHaveFocus());
      }
    );

    await step("Press ArrowDown to move focus to Reload", async () => {
      await userEvent.keyboard("{ArrowDown}");
      await waitFor(() => expect(items[2]).toHaveFocus());
    });

    await step(
      "Press ArrowUp to move focus back to the disabled item",
      async () => {
        await userEvent.keyboard("{ArrowUp}");
        await waitFor(() => expect(items[1]).toHaveFocus());
      }
    );

    await step("Press Escape to close the menu", async () => {
      await userEvent.keyboard("{Escape}");
      await waitFor(() => expect(menu).toHaveAttribute("data-closed"));
    });
  }
);

Destructive.test(
  "the destructive item renders with the correct variant",
  async ({ canvasElement, canvas, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("Right-click to open the menu", async () => {
      await userEvent.pointer({
        keys: "[MouseRight>]",
        target: await canvas.findByText(/click here/i),
        coords: {
          x: canvasElement.clientWidth / 2,
          y: canvasElement.clientHeight / 2,
        },
      });
    });

    await step("Verify the Delete item has destructive variant", async () => {
      const deleteItem = await canvasBody.findByText("Delete");
      const menuItem = deleteItem.closest("[data-slot='context-menu-item']")!;
      await expect(menuItem).toHaveAttribute("data-variant", "destructive");
    });
  }
);
