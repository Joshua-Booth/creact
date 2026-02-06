import preview from "@/storybook/preview";
import { expect, userEvent, within } from "storybook/test";

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
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
  argTypes: {},

  render: (args) => (
    <Menubar {...args}>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>New Window</MenubarItem>
          <MenubarSeparator />
          <MenubarItem disabled>Share</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
  parameters: {
    layout: "centered",
  },
});

// --- Stories ---

/**
 * The default form of the menubar.
 */
export const Default = meta.story();

/**
 * A menubar with a submenu.
 */
export const WithSubmenu = meta.story({
  render: (args) => (
    <Menubar {...args}>
      <MenubarMenu>
        <MenubarTrigger>Actions</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Download</MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email link</MenubarItem>
              <MenubarItem>Messages</MenubarItem>
              <MenubarItem>Notes</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
});

/**
 * A menubar with radio items.
 */
export const WithRadioItems = meta.story({
  render: (args) => (
    <Menubar {...args}>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel inset>Device Size</MenubarLabel>
          <MenubarRadioGroup value="md">
            <MenubarRadioItem value="sm">Small</MenubarRadioItem>
            <MenubarRadioItem value="md">Medium</MenubarRadioItem>
            <MenubarRadioItem value="lg">Large</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
});

/**
 * A menubar with checkbox items.
 */
export const WithCheckboxItems = meta.story({
  render: (args) => (
    <Menubar {...args}>
      <MenubarMenu>
        <MenubarTrigger>Filters</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Show All</MenubarItem>
          <MenubarGroup>
            <MenubarCheckboxItem checked>Unread</MenubarCheckboxItem>
            <MenubarCheckboxItem checked>Important</MenubarCheckboxItem>
            <MenubarCheckboxItem>Flagged</MenubarCheckboxItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
});

// --- Tests ---

Default.test(
  "when clicking an item, should close the menubar",
  async ({ canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("open the menubar", async () => {
      await userEvent.click(
        await canvasBody.findByRole("menuitem", { name: /file/i })
      );
      await expect(await canvasBody.findByRole("menu")).toBeInTheDocument();
    });

    const items = await canvasBody.findAllByRole("menuitem");
    await expect(items).toHaveLength(5);

    await step("click the first item to close the menubar", async () => {
      const item = items[0];
      if (item) {
        await userEvent.click(item, { delay: 100 });
      }
    });
  }
);
