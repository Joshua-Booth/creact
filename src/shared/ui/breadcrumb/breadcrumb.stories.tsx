import preview from "@/storybook/preview";
import { ArrowRightIcon } from "lucide-react";
import { expect, userEvent, within } from "storybook/test";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";

/**
 * Displays the path to the current resource using a hierarchy of links.
 */
const meta = preview.meta({
  title: "ui/Breadcrumb",
  component: Breadcrumb,
  argTypes: {},
  args: {},
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/products">Products</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Electronics</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  parameters: {
    docs: {
      description: {
        component:
          "Displays the path to the current resource using a hierarchy of links.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/breadcrumb)",
      },
    },
    layout: "centered",
  },
});

// --- Stories ---

/**
 * Basic breadcrumb navigation showing hierarchical path.
 */
export const Default = meta.story();

/**
 * Customize the separator between breadcrumb items with any icon or element.
 */
export const WithCustomSeparator = meta.story({
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ArrowRightIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ArrowRightIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Account</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
});

/**
 * For long paths, collapse intermediate items with an ellipsis to save space.
 */
export const Collapsed = meta.story({
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Docs</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs/api">API Reference</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Authentication</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
});

/**
 * Combine the ellipsis with a dropdown menu to reveal hidden path segments on demand.
 */
export const WithDropdown = meta.story({
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center gap-1"
              aria-label="Show more breadcrumb items"
            >
              <BreadcrumbEllipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Products</DropdownMenuItem>
              <DropdownMenuItem>Categories</DropdownMenuItem>
              <DropdownMenuItem>Electronics</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/products/electronics/audio">
            Audio
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Headphones</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
});

// --- Tests ---

Default.test(
  "when clicking ellipsis, should reveal dropdown menu items",
  {
    render: WithDropdown.input.render,
  },
  async ({ canvas, canvasElement, step }) => {
    const trigger = await canvas.findByRole("button", {
      name: "Show more breadcrumb items",
    });

    await step("click ellipsis trigger", async () => {
      await userEvent.click(trigger);
    });

    await step("verify dropdown menu items appear", async () => {
      const body = within(canvasElement.ownerDocument.body);
      await expect(
        await body.findByRole("menuitem", { name: "Products" })
      ).toBeInTheDocument();
      await expect(
        await body.findByRole("menuitem", { name: "Categories" })
      ).toBeInTheDocument();
      await expect(
        await body.findByRole("menuitem", { name: "Electronics" })
      ).toBeInTheDocument();
    });
  }
);

/**
 * Use the `render` prop to integrate with React Router's Link component for client-side navigation.
 */
export const WithRenderProp = meta.story({
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          {/* eslint-disable-next-line jsx-a11y/anchor-has-content -- content provided by BreadcrumbLink children */}
          <BreadcrumbLink render={<a href="/" />}>Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {/* eslint-disable-next-line jsx-a11y/anchor-has-content -- content provided by BreadcrumbLink children */}
          <BreadcrumbLink render={<a href="/settings" />}>
            Settings
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {/* eslint-disable-next-line jsx-a11y/anchor-has-content -- content provided by BreadcrumbLink children */}
          <BreadcrumbLink render={<a href="/settings/account" />}>
            Account
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Security</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
});
