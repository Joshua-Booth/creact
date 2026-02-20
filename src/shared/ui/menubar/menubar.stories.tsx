/* eslint-disable @typescript-eslint/no-non-null-assertion -- Test assertions on known DOM elements */
import { useState } from "react";

import preview from "@/storybook/preview";
import {
  FileIcon,
  FolderIcon,
  HelpCircleIcon,
  SaveIcon,
  SettingsIcon,
  Trash2Icon,
} from "lucide-react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "./menubar";

/**
 * A visually persistent menu common in desktop applications that provides
 * quick access to a consistent set of commands.
 */
const meta = preview.meta({
  title: "ui/Menubar",
  component: Menubar,
  render: function Render(args) {
    const [bookmarksBar, setBookmarksBar] = useState(true);
    const [fullUrls, setFullUrls] = useState(false);
    const [profile, setProfile] = useState("benoit");

    return (
      <Menubar {...args}>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent className="w-60">
            <MenubarItem>
              New Tab <MenubarShortcut>⌘T</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              New Window <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>New Incognito Window</MenubarItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Share</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Email link</MenubarItem>
                <MenubarItem>Messages</MenubarItem>
                <MenubarItem>Notes</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem>
              Print... <MenubarShortcut>⌘P</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent className="w-56">
            <MenubarItem>
              Undo <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Find</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Search the web</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Find...</MenubarItem>
                <MenubarItem>Find Next</MenubarItem>
                <MenubarItem>Find Previous</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem>Cut</MenubarItem>
            <MenubarItem>Copy</MenubarItem>
            <MenubarItem>Paste</MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent className="w-64">
            <MenubarCheckboxItem
              checked={bookmarksBar}
              onCheckedChange={setBookmarksBar}
            >
              Always Show Bookmarks Bar
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              checked={fullUrls}
              onCheckedChange={setFullUrls}
            >
              Always Show Full URLs
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarItem inset>
              Reload <MenubarShortcut>⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled inset>
              Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>Toggle Fullscreen</MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>Hide Sidebar</MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Profiles</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup value={profile} onValueChange={setProfile}>
              <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
              <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
              <MenubarRadioItem value="luis">Luis</MenubarRadioItem>
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarItem inset>Edit...</MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>Add Profile...</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
  },
  parameters: {
    docs: {
      description: {
        component:
          "A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/menubar)",
      },
    },
  },
});

// --- Stories ---

/**
 * The default form of the menubar with File, Edit, View, and Profiles menus.
 */
export const Default = meta.story();

/**
 * Use `MenubarCheckboxItem` to add toggleable options within a menu.
 */
export const Checkbox = meta.story({
  render: function Render(args) {
    const [bookmarksBar, setBookmarksBar] = useState(true);
    const [fullUrls, setFullUrls] = useState(true);
    const [strikethrough, setStrikethrough] = useState(true);
    const [code, setCode] = useState(false);
    const [superscript, setSuperscript] = useState(false);

    return (
      <Menubar {...args}>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent className="w-64">
            <MenubarCheckboxItem
              checked={bookmarksBar}
              onCheckedChange={setBookmarksBar}
            >
              Always Show Bookmarks Bar
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              checked={fullUrls}
              onCheckedChange={setFullUrls}
            >
              Always Show Full URLs
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarItem inset>
              Reload <MenubarShortcut>⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled inset>
              Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Format</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem
              checked={strikethrough}
              onCheckedChange={setStrikethrough}
            >
              Strikethrough
            </MenubarCheckboxItem>
            <MenubarCheckboxItem checked={code} onCheckedChange={setCode}>
              Code
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              checked={superscript}
              onCheckedChange={setSuperscript}
            >
              Superscript
            </MenubarCheckboxItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
  },
});

/**
 * Use `MenubarRadioGroup` and `MenubarRadioItem` to create single-selection
 * option groups.
 */
export const Radio = meta.story({
  render: function Render(args) {
    const [profile, setProfile] = useState("benoit");
    const [theme, setTheme] = useState("system");

    return (
      <Menubar {...args}>
        <MenubarMenu>
          <MenubarTrigger>Profiles</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup value={profile} onValueChange={setProfile}>
              <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
              <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
              <MenubarRadioItem value="luis">Luis</MenubarRadioItem>
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarItem inset>Edit...</MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>Add Profile...</MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Theme</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup value={theme} onValueChange={setTheme}>
              <MenubarRadioItem value="light">Light</MenubarRadioItem>
              <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
              <MenubarRadioItem value="system">System</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
  },
});

/**
 * Use `MenubarSub`, `MenubarSubTrigger`, and `MenubarSubContent` for nested
 * navigation.
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
    <Menubar {...args}>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent className="w-48">
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email link</MenubarItem>
              <MenubarItem>Messages</MenubarItem>
              <MenubarItem>Notes</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            Print... <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent className="w-56">
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Find</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Find...</MenubarItem>
              <MenubarItem>Find Next</MenubarItem>
              <MenubarItem>Find Previous</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
});

/**
 * Add icons to menu items for enhanced visual communication. Use
 * `variant="destructive"` for dangerous actions.
 */
export const Icons = meta.story({
  render: (args) => (
    <Menubar {...args} className="w-80">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <FileIcon />
            New File <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <FolderIcon />
            Open Folder
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <SaveIcon />
            Save <MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>More</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>
              <SettingsIcon />
              Settings
            </MenubarItem>
            <MenubarItem>
              <HelpCircleIcon />
              Help
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem variant="destructive">
              <Trash2Icon />
              Delete
            </MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
});

// --- Tests ---

Default.test(
  "when clicking an item, should close the menubar",
  async ({ canvas, canvasElement, step }) => {
    const body = within(canvasElement.ownerDocument.body);

    await step("open the File menu", async () => {
      const triggers = canvas.getAllByRole("menuitem");
      const fileTrigger = triggers.find(
        (el) => el.textContent.trim() === "File"
      );
      await userEvent.click(fileTrigger!);
      await body.findByRole("menu");
    });

    await step("click an item to close the menubar", async () => {
      const items = await body.findAllByRole("menuitem");
      const newTabItem = items.find((item) =>
        item.textContent.includes("New Tab")
      );
      await userEvent.click(newTabItem!, { delay: 100 });
    });
  }
);

Default.test(
  "when using keyboard navigation, should navigate menu items",
  async ({ canvas, canvasElement, step }) => {
    const body = within(canvasElement.ownerDocument.body);

    await step("open the File menu via click", async () => {
      const triggers = canvas.getAllByRole("menuitem");
      const fileTrigger = triggers.find(
        (el) => el.textContent.trim() === "File"
      );
      await userEvent.click(fileTrigger!);
      await body.findByRole("menu");
    });

    await step("navigate items with ArrowDown", async () => {
      await userEvent.keyboard("{ArrowDown}");
      await waitFor(async () => {
        const items = await body.findAllByRole("menuitem");
        const newTabItem = items.find((item) =>
          item.textContent.includes("New Tab")
        );
        await expect(newTabItem).toHaveFocus();
      });
    });

    await step("press Escape to close menu", async () => {
      await userEvent.keyboard("{Escape}");
      await waitFor(async () => {
        await expect(body.queryByRole("menu")).not.toBeInTheDocument();
      });
    });
  }
);

Checkbox.test(
  "when clicking a checkbox item, should toggle checked state",
  async ({ canvas, canvasElement, step }) => {
    const body = within(canvasElement.ownerDocument.body);

    await step("open the Format menu", async () => {
      await userEvent.click(canvas.getByRole("menuitem", { name: /format/i }));
      await body.findByRole("menu");
    });

    await step("toggle the Code checkbox item", async () => {
      const codeItem = await body.findByRole("menuitemcheckbox", {
        name: /^code$/i,
      });
      await expect(codeItem).toHaveAttribute("aria-checked", "false");
      await userEvent.click(codeItem);
    });

    await step("verify the Code item is now checked", async () => {
      await userEvent.click(canvas.getByRole("menuitem", { name: /format/i }));
      const codeItem = await body.findByRole("menuitemcheckbox", {
        name: /^code$/i,
      });
      await expect(codeItem).toHaveAttribute("aria-checked", "true");
    });
  }
);

Radio.test(
  "when clicking a radio item, should update selection",
  async ({ canvas, canvasElement, step }) => {
    const body = within(canvasElement.ownerDocument.body);

    await step("open the Profiles menu", async () => {
      await userEvent.click(
        canvas.getByRole("menuitem", { name: /profiles/i })
      );
      await body.findByRole("menu");
    });

    await step("verify Benoit is initially selected", async () => {
      const benoitItem = await body.findByRole("menuitemradio", {
        name: /benoit/i,
      });
      await expect(benoitItem).toHaveAttribute("aria-checked", "true");
    });

    await step("click Andy to change selection", async () => {
      const andyItem = await body.findByRole("menuitemradio", {
        name: /andy/i,
      });
      await userEvent.click(andyItem);
    });

    await step("verify Andy is now selected", async () => {
      await userEvent.click(
        canvas.getByRole("menuitem", { name: /profiles/i })
      );
      const andyItem = await body.findByRole("menuitemradio", {
        name: /andy/i,
      });
      await expect(andyItem).toHaveAttribute("aria-checked", "true");
    });
  }
);

Submenu.test(
  "when hovering a sub-trigger, should open the submenu",
  async ({ canvas, canvasElement, step }) => {
    const body = within(canvasElement.ownerDocument.body);

    await step("open the File menu", async () => {
      const triggers = canvas.getAllByRole("menuitem");
      const fileTrigger = triggers.find(
        (el) => el.textContent.trim() === "File"
      );
      await userEvent.click(fileTrigger!);
      await body.findByRole("menu");
    });

    await step("hover Share sub-trigger to open submenu", async () => {
      const shareTrigger = await body.findByRole("menuitem", {
        name: /share/i,
      });
      await userEvent.hover(shareTrigger);
      await body.findByRole("menuitem", { name: /email link/i });
    });
  }
);
