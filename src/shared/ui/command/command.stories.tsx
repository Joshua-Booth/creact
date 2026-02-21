import { useState } from "react";

import preview from "@/storybook/preview";
import {
  Calculator,
  Calendar,
  CommandIcon,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react";
import { expect, userEvent } from "storybook/test";

import { Button } from "../button";
import { Kbd, KbdGroup } from "../kbd";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./command";

/**
 * Fast, composable, unstyled command menu for React.
 */
const meta = preview.meta({
  title: "ui/Command",
  component: Command,
  args: {
    className: "rounded-lg w-96 border shadow-md",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Fast, composable, unstyled command menu for React.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/command) · [cmdk docs](https://github.com/dip/cmdk)",
      },
    },
  },
});

// --- Stories ---

/**
 * The default form of the command.
 */
export const Default = meta.story({
  render: (args) => (
    <Command {...args}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search Emoji</CommandItem>
          <CommandItem disabled>Calculator</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>Profile</CommandItem>
          <CommandItem>Billing</CommandItem>
          <CommandItem>Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
});

/**
 * Command menu inside a dialog, typically triggered with a keyboard shortcut.
 */
export const Dialog = meta.story({
  args: { className: "" },
  render: function Render(args) {
    const [open, setOpen] = useState(false);

    return (
      <>
        <CommandDialog open={open} onOpenChange={setOpen} className="w-full">
          <Command {...args}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>
                  <Calendar />
                  <span>Calendar</span>
                </CommandItem>
                <CommandItem>
                  <Smile />
                  <span>Search Emoji</span>
                </CommandItem>
                <CommandItem>
                  <Calculator />
                  <span>Calculator</span>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Settings">
                <CommandItem>
                  <User />
                  <span>Profile</span>
                  <CommandShortcut>⌘P</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <CreditCard />
                  <span>Billing</span>
                  <CommandShortcut>⌘B</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <Settings />
                  <span>Settings</span>
                  <CommandShortcut>⌘S</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </CommandDialog>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Press{" "}
          <KbdGroup>
            <Kbd>
              <CommandIcon />
            </Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </Button>
      </>
    );
  },
});

/**
 * Command menu as a dropdown/combobox triggered by a popover.
 */
export const PopoverStory = meta.story({
  name: "Popover",
  args: { className: "" },
  render: function Render(args) {
    const [open, setOpen] = useState(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={<Button variant="outline">Open Command</Button>}
        />
        <PopoverContent className="w-56 p-0">
          <Command {...args}>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                <CommandItem onSelect={() => setOpen(false)}>
                  <Calendar />
                  <span>Calendar</span>
                </CommandItem>
                <CommandItem onSelect={() => setOpen(false)}>
                  <Smile />
                  <span>Search Emoji</span>
                </CommandItem>
                <CommandItem onSelect={() => setOpen(false)}>
                  <Calculator />
                  <span>Calculator</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
});

/**
 * Command with grouped items, icons, and keyboard shortcuts.
 */
export const Groups = meta.story({
  render: (args) => (
    <Command {...args}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <Calendar />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <Smile />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem disabled>
            <Calculator />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <User />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCard />
            <span>Billing</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Settings />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
});

/**
 * Command items with keyboard shortcuts for quick access.
 */
export const Shortcuts = meta.story({
  render: (args) => (
    <Command {...args}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem>
            <span>New File</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Open File</span>
            <CommandShortcut>⌘O</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Save</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Save As...</span>
            <CommandShortcut>⇧⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Edit">
          <CommandItem>
            <span>Undo</span>
            <CommandShortcut>⌘Z</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Redo</span>
            <CommandShortcut>⇧⌘Z</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Cut</span>
            <CommandShortcut>⌘X</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Copy</span>
            <CommandShortcut>⌘C</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Paste</span>
            <CommandShortcut>⌘V</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
});

/**
 * Command with many items demonstrating scrollable list behavior.
 */
export const ManyItems = meta.story({
  render: (args) => (
    <Command {...args}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Recently Used">
          <CommandItem>
            <Calendar />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <Settings />
            <span>Settings</span>
          </CommandItem>
          <CommandItem>
            <User />
            <span>Profile</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Applications">
          <CommandItem>
            <Calculator />
            <span>Calculator</span>
          </CommandItem>
          <CommandItem>
            <Calendar />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <CreditCard />
            <span>Wallet</span>
          </CommandItem>
          <CommandItem>
            <Smile />
            <span>Emoji Picker</span>
          </CommandItem>
          <CommandItem>
            <Settings />
            <span>System Preferences</span>
          </CommandItem>
          <CommandItem>
            <User />
            <span>Contacts</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Documents">
          <CommandItem>
            <span>Annual Report 2024.pdf</span>
          </CommandItem>
          <CommandItem>
            <span>Meeting Notes.md</span>
          </CommandItem>
          <CommandItem>
            <span>Project Proposal.docx</span>
          </CommandItem>
          <CommandItem>
            <span>Budget Spreadsheet.xlsx</span>
          </CommandItem>
          <CommandItem>
            <span>Presentation.pptx</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Quick Actions">
          <CommandItem>
            <span>New Document</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Open Recent</span>
            <CommandShortcut>⌘O</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Quick Search</span>
            <CommandShortcut>⌘K</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Toggle Theme</span>
            <CommandShortcut>⌘T</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
});

// --- Tests ---

Default.test(
  "should filter results when typing in combobox",
  async ({ canvas, step }) => {
    const input = canvas.getByRole("combobox");

    await step(
      "search for 'calen' returns single Calendar result",
      async () => {
        // cspell:ignore calen
        await userEvent.type(input, "calen", { delay: 100 });
        await expect(
          canvas.getAllByRole("option", { name: /calendar/i })
        ).toHaveLength(1);
        await userEvent.clear(input);
      }
    );

    await step("search for 'se' returns multiple results", async () => {
      await userEvent.type(input, "se", { delay: 100 });
      await expect(canvas.getAllByRole("option").length).toBeGreaterThan(1);
      await expect(
        canvas.getAllByRole("option", { name: /search/i })
      ).toHaveLength(1);
      await userEvent.clear(input);
    });

    await step("search for 'story' returns no results", async () => {
      await userEvent.type(input, "story", { delay: 100 });
      await expect(
        canvas.queryAllByRole("option", { hidden: false })
      ).toHaveLength(0);
      await expect(canvas.getByText(/no results/i)).toBeVisible();
    });
  }
);
