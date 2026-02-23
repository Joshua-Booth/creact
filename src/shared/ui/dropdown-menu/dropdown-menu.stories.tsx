/* eslint-disable @typescript-eslint/no-non-null-assertion -- Test assertions on known DOM elements */
import { useState } from "react";

import preview from "@/storybook/preview";
import {
  BadgeCheck,
  Bell,
  Building2,
  CreditCard,
  Download,
  Eye,
  File,
  FileCode,
  FileText,
  Folder,
  FolderOpen,
  FolderSearch,
  HelpCircle,
  Keyboard,
  Languages,
  Layout,
  LogOut,
  Mail,
  MessageSquare,
  Monitor,
  Moon,
  MoreHorizontal,
  Palette,
  Pencil,
  Save,
  Settings,
  Share,
  Shield,
  Sun,
  Trash,
  User,
  Wallet,
} from "lucide-react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Button } from "../button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu";

/**
 * Displays a menu to the user — such as a set of actions or functions —
 * triggered by a button.
 */
const meta = preview.meta({
  title: "ui/DropdownMenu",
  component: DropdownMenu,
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Open
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            New Team
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>GitHub</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuItem disabled>API</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  parameters: {
    docs: {
      description: {
        component:
          "Displays a menu to the user — such as a set of actions or functions — triggered by a button. See also [ContextMenu](?path=/docs/ui-contextmenu--docs) for right-click menus.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/dropdown-menu) · [Base UI docs](https://base-ui.com/react/components/menu)",
      },
    },
  },
});

// --- Stories ---

/**
 * The default form of the dropdown menu.
 */
export const Default = meta.story();

/**
 * A basic dropdown menu with labels and separators.
 */
export const Basic = meta.story({
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Open
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>GitHub</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuItem disabled>API</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
});

/**
 * Use `DropdownMenuSub` to nest secondary actions.
 */
export const Submenu = meta.story({
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Open
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>More options</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>Calendly</DropdownMenuItem>
                      <DropdownMenuItem>Slack</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Webhook</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Advanced...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            New Team
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
});

/**
 * Add `DropdownMenuShortcut` to show keyboard hints.
 */
export const Shortcuts = meta.story({
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Open
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
});

/**
 * Combine icons with labels for quick scanning.
 */
export const Icons = meta.story({
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Open
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <User />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCard />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
});

/**
 * Use `DropdownMenuCheckboxItem` for toggles.
 */
export const Checkboxes = meta.story({
  render: (args) => {
    const [showStatusBar, setShowStatusBar] = useState(true);
    const [showActivityBar, setShowActivityBar] = useState(false);
    const [showPanel, setShowPanel] = useState(false);

    return (
      <DropdownMenu {...args}>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Open
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Appearance</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={showStatusBar}
              onCheckedChange={setShowStatusBar}
            >
              Status Bar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showActivityBar}
              onCheckedChange={setShowActivityBar}
              disabled
            >
              Activity Bar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showPanel}
              onCheckedChange={setShowPanel}
            >
              Panel
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
});

/**
 * Add icons to checkbox items.
 */
export const CheckboxesIcons = meta.story({
  render: (args) => {
    const [notifications, setNotifications] = useState({
      email: true,
      sms: false,
      push: true,
    });

    return (
      <DropdownMenu {...args}>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Notifications
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Notification Preferences</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={notifications.email}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, email: checked })
              }
            >
              <Mail />
              Email notifications
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={notifications.sms}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, sms: checked })
              }
            >
              <MessageSquare />
              SMS notifications
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={notifications.push}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, push: checked })
              }
            >
              <Bell />
              Push notifications
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
});

/**
 * Use `DropdownMenuRadioGroup` for exclusive choices.
 */
export const RadioGroup = meta.story({
  render: (args) => {
    const [position, setPosition] = useState("bottom");

    return (
      <DropdownMenu {...args}>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Open
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-32">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={position}
              onValueChange={setPosition}
            >
              <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bottom">
                Bottom
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
});

/**
 * Show radio options with icons.
 */
export const RadioIcons = meta.story({
  render: (args) => {
    const [paymentMethod, setPaymentMethod] = useState("card");

    return (
      <DropdownMenu {...args}>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Payment Method
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Select Payment Method</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
            >
              <DropdownMenuRadioItem value="card">
                <CreditCard />
                Credit Card
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="paypal">
                <Wallet />
                PayPal
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bank">
                <Building2 />
                Bank Transfer
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
});

/**
 * Use `variant="destructive"` for irreversible actions.
 */
export const Destructive = meta.story({
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Actions
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Pencil />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Share />
            Share
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive">
            <Trash />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
});

/**
 * An account switcher dropdown triggered by an avatar.
 */
export const AvatarStory = meta.story({
  name: "Avatar",
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon" className="rounded-full" />}
      >
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
});

/**
 * A richer example combining groups, icons, and submenus.
 */
export const Complex = meta.story({
  render: (args) => {
    const [notifications, setNotifications] = useState({
      email: true,
      sms: false,
      push: true,
    });
    const [theme, setTheme] = useState("light");

    return (
      <DropdownMenu {...args}>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Complex Menu
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>File</DropdownMenuLabel>
            <DropdownMenuItem>
              <File />
              New File
              <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Folder />
              New Folder
              <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <FolderOpen />
                Open Recent
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Recent Projects</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <FileCode />
                      Project Alpha
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileCode />
                      Project Beta
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <MoreHorizontal />
                        More Projects
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem>
                            <FileCode />
                            Project Gamma
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileCode />
                            Project Delta
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <FolderSearch />
                      Browse...
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Save />
              Save
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download />
              Export
              <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>View</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={notifications.email}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, email: checked })
              }
            >
              <Eye />
              Show Sidebar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={notifications.sms}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, sms: checked })
              }
            >
              <Layout />
              Show Status Bar
            </DropdownMenuCheckboxItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Palette />
                Theme
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      value={theme}
                      onValueChange={setTheme}
                    >
                      <DropdownMenuRadioItem value="light">
                        <Sun />
                        Light
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="dark">
                        <Moon />
                        Dark
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="system">
                        <Monitor />
                        System
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuItem>
              <User />
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard />
              Billing
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Settings />
                Settings
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Preferences</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Keyboard />
                      Keyboard Shortcuts
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Languages />
                      Language
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Bell />
                        Notifications
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>
                              Notification Types
                            </DropdownMenuLabel>
                            <DropdownMenuCheckboxItem
                              checked={notifications.push}
                              onCheckedChange={(checked) =>
                                setNotifications({
                                  ...notifications,
                                  push: checked,
                                })
                              }
                            >
                              <Bell />
                              Push Notifications
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                              checked={notifications.email}
                              onCheckedChange={(checked) =>
                                setNotifications({
                                  ...notifications,
                                  email: checked,
                                })
                              }
                            >
                              <Mail />
                              Email Notifications
                            </DropdownMenuCheckboxItem>
                          </DropdownMenuGroup>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Shield />
                      Privacy & Security
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <HelpCircle />
              Help & Support
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText />
              Documentation
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">
              <LogOut />
              Sign Out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
});

/**
 * Dropdown menus with different positions and alignments.
 */
export const Positions = meta.story({
  render: (args) => (
    <div className="flex flex-wrap items-center justify-center gap-8 p-16">
      <DropdownMenu {...args}>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Bottom Start
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start" className="w-40">
          <DropdownMenuItem>Option 1</DropdownMenuItem>
          <DropdownMenuItem>Option 2</DropdownMenuItem>
          <DropdownMenuItem>Option 3</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu {...args}>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Bottom Center
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="center" className="w-40">
          <DropdownMenuItem>Option 1</DropdownMenuItem>
          <DropdownMenuItem>Option 2</DropdownMenuItem>
          <DropdownMenuItem>Option 3</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu {...args}>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Bottom End
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end" className="w-40">
          <DropdownMenuItem>Option 1</DropdownMenuItem>
          <DropdownMenuItem>Option 2</DropdownMenuItem>
          <DropdownMenuItem>Option 3</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu {...args}>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Top Start
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="w-40">
          <DropdownMenuItem>Option 1</DropdownMenuItem>
          <DropdownMenuItem>Option 2</DropdownMenuItem>
          <DropdownMenuItem>Option 3</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu {...args}>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Right Start
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="w-40">
          <DropdownMenuItem>Option 1</DropdownMenuItem>
          <DropdownMenuItem>Option 2</DropdownMenuItem>
          <DropdownMenuItem>Option 3</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu {...args}>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Left Start
        </DropdownMenuTrigger>
        <DropdownMenuContent side="left" align="start" className="w-40">
          <DropdownMenuItem>Option 1</DropdownMenuItem>
          <DropdownMenuItem>Option 2</DropdownMenuItem>
          <DropdownMenuItem>Option 3</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
});

// --- Tests ---

Default.test(
  "when clicking an item, should close the dropdown menu",
  async ({ canvasElement, step }) => {
    const body = within(canvasElement.ownerDocument.body);

    await step("Open the dropdown menu", async () => {
      await userEvent.click(await body.findByRole("button", { name: /open/i }));
      await expect(await body.findByRole("menu")).toBeInTheDocument();
    });
    const items = await body.findAllByRole("menuitem");
    await expect(items).toHaveLength(10);

    await step("Click the first menu item", async () => {
      await userEvent.click(items[0]!, { delay: 100 });
    });
  }
);

Default.test(
  "when using keyboard, should open menu and navigate items",
  {
    render: (args) => (
      <DropdownMenu {...args}>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Open
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem>First</DropdownMenuItem>
            <DropdownMenuItem>Second</DropdownMenuItem>
            <DropdownMenuItem>Third</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  async ({ canvas, canvasElement, step }) => {
    const body = within(canvasElement.ownerDocument.body);

    await step("focus trigger and press Enter to open menu", async () => {
      const trigger = canvas.getByRole("button", { name: /open/i });
      await userEvent.click(trigger);
      const menu = await body.findByRole("menu");
      await expect(menu).toBeInTheDocument();
      await waitFor(() =>
        expect(menu.contains(menu.ownerDocument.activeElement)).toBeTruthy()
      );
    });

    await step("navigate items with ArrowDown", async () => {
      await userEvent.keyboard("{ArrowDown}");
      const items = await body.findAllByRole("menuitem");
      await expect(items[0]).toHaveFocus();
    });

    await step("press Escape to close menu", async () => {
      await userEvent.keyboard("{Escape}");
      await waitFor(async () => {
        await expect(body.queryByRole("menu")).not.toBeInTheDocument();
      });
    });
  }
);
