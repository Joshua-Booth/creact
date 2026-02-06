import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  CircleCheckIcon,
  CircleHelpIcon,
  CircleIcon,
  FileTextIcon,
  LayoutIcon,
  RocketIcon,
} from "lucide-react";
import { expect, userEvent, within } from "storybook/test";

import { cn } from "../../lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./navigation-menu";

/**
 * A collection of links for navigating websites.
 */
const meta = {
  title: "ui/NavigationMenu",
  component: NavigationMenu,
  tags: ["autodocs"],
  argTypes: {},
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof NavigationMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

function ListItem({
  className,
  title,
  children,
  href,
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  href: string;
}) {
  return (
    <li>
      <NavigationMenuLink
        href={href}
        className={cn(
          `hover:bg-muted focus:bg-muted block space-y-1 rounded-md p-3
          leading-none no-underline transition-colors outline-none select-none`,
          className
        )}
      >
        <div className="text-sm leading-none font-medium">{title}</div>
        <p className="text-muted-foreground line-clamp-2 text-sm/snug">
          {children}
        </p>
      </NavigationMenuLink>
    </li>
  );
}

/**
 * The default form of the navigation menu with a simple trigger and dropdown.
 */
export const Default: Story = {
  render: (args) => (
    <NavigationMenu {...args}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-52 gap-1 p-2">
              <ListItem title="Introduction" href="/docs/introduction">
                Getting started with the library.
              </ListItem>
              <ListItem title="Installation" href="/docs/installation">
                How to install and configure.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            href="/docs"
          >
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

const gettingStartedItems = [
  {
    title: "Introduction",
    href: "/docs",
    description: "Re-usable components built using Radix UI and Tailwind CSS.",
  },
  {
    title: "Installation",
    href: "/docs/installation",
    description: "How to install dependencies and structure your app.",
  },
  {
    title: "Typography",
    href: "/docs/typography",
    description: "Styles for headings, paragraphs, lists...etc",
  },
];

const components = [
  {
    title: "Alert Dialog",
    href: "/docs/components/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/components/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/components/progress",
    description:
      "Displays an indicator showing the completion progress of a task.",
  },
  {
    title: "Scroll Area",
    href: "/docs/components/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/components/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/components/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

/**
 * Navigation menu with a "Getting Started" panel featuring description cards and a highlighted hero item.
 */
export const GettingStarted: Story = {
  render: (args) => (
    <NavigationMenu {...args}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul
              className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]
                lg:grid-cols-[.75fr_1fr]"
            >
              <li className="row-span-3">
                <NavigationMenuLink
                  href="/"
                  className="from-muted/50 to-muted flex size-full flex-col
                    justify-end rounded-md bg-linear-to-b p-6 no-underline
                    transition-all duration-200 outline-none select-none
                    focus:shadow-md"
                >
                  <RocketIcon className="size-6" />
                  <div className="mt-4 mb-2 text-lg font-medium">shadcn/ui</div>
                  <p className="text-muted-foreground text-sm/tight">
                    Beautifully designed components built with Tailwind CSS.
                  </p>
                </NavigationMenuLink>
              </li>
              {gettingStartedItems.map((item) => (
                <ListItem key={item.title} href={item.href} title={item.title}>
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            href="/docs"
          >
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

/**
 * Navigation menu with a components list panel showing a grid of component descriptions.
 */
export const Components: Story = {
  render: (args) => (
    <NavigationMenu {...args}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul
              className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2
                lg:w-[600px]"
            >
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            href="/docs"
          >
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

const listItems = [
  {
    title: "Alert Dialog",
    href: "/docs/components/alert-dialog",
    description: "A modal dialog that interrupts the user.",
  },
  {
    title: "Hover Card",
    href: "/docs/components/hover-card",
    description: "Preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/components/progress",
    description: "Displays completion progress of a task.",
  },
];

/**
 * Navigation menu with a list of links showing title and description.
 */
export const List: Story = {
  render: (args) => (
    <NavigationMenu {...args}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>List</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-80 gap-1">
              {listItems.map((item) => (
                <ListItem key={item.title} title={item.title} href={item.href}>
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            href="/docs"
          >
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

const simpleItems = [
  { title: "Introduction", href: "/docs/introduction" },
  { title: "Installation", href: "/docs/installation" },
  { title: "Typography", href: "/docs/typography" },
  { title: "CLI", href: "/docs/cli" },
];

/**
 * Navigation menu with simple text-only links.
 */
export const Simple: Story = {
  render: (args) => (
    <NavigationMenu {...args}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Simple</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-40 gap-1">
              {simpleItems.map((item) => (
                <li key={item.title}>
                  <NavigationMenuLink
                    href={item.href}
                    className="hover:bg-muted focus:bg-muted block rounded-md
                      px-3 py-2 text-sm transition-colors outline-none
                      select-none"
                  >
                    {item.title}
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            href="/docs"
          >
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

/**
 * Navigation menu items with icons for visual context.
 */
export const WithIcon: Story = {
  render: (args) => (
    <NavigationMenu {...args}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Status</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-52 gap-1">
              <li>
                <NavigationMenuLink
                  href="/status/backlog"
                  className="hover:bg-muted focus:bg-muted flex items-center
                    gap-2 rounded-md p-2 text-sm transition-colors outline-none
                    select-none"
                >
                  <CircleHelpIcon />
                  Backlog
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink
                  href="/status/todo"
                  className="hover:bg-muted focus:bg-muted flex items-center
                    gap-2 rounded-md p-2 text-sm transition-colors outline-none
                    select-none"
                >
                  <CircleIcon />
                  To Do
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink
                  href="/status/done"
                  className="hover:bg-muted focus:bg-muted flex items-center
                    gap-2 rounded-md p-2 text-sm transition-colors outline-none
                    select-none"
                >
                  <CircleCheckIcon />
                  Done
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-52 gap-1">
              <li>
                <NavigationMenuLink
                  href="/docs"
                  className="hover:bg-muted focus:bg-muted flex items-center
                    gap-2 rounded-md p-2 text-sm transition-colors outline-none
                    select-none"
                >
                  <FileTextIcon />
                  Documentation
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink
                  href="/components"
                  className="hover:bg-muted focus:bg-muted flex items-center
                    gap-2 rounded-md p-2 text-sm transition-colors outline-none
                    select-none"
                >
                  <LayoutIcon />
                  Components
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

export const ShouldOpenClose: Story = {
  name: "when clicking trigger, should open and display content",
  tags: ["!dev", "!autodocs"],
  render: (args) => (
    <NavigationMenu {...args} aria-label="Main navigation">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-52 gap-1 p-2">
              <ListItem title="Introduction" href="/docs/introduction">
                Getting started with the library.
              </ListItem>
              <ListItem title="Installation" href="/docs/installation">
                How to install and configure.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            href="/docs"
          >
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
  play: async ({ canvasElement, step }) => {
    const body = within(canvasElement.ownerDocument.body);
    const canvas = within(canvasElement);

    await step("Open the navigation menu", async () => {
      await userEvent.click(
        await canvas.findByRole("button", { name: /getting started/i })
      );
    });

    await step("Verify menu content is visible", async () => {
      await expect(await body.findByText("Introduction")).toBeInTheDocument();
      await expect(await body.findByText("Installation")).toBeInTheDocument();
    });
  },
};
