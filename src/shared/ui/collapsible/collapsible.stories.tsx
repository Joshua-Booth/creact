import { useState } from "react";

import preview from "@/storybook/preview";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  FileIcon,
  FolderIcon,
  MaximizeIcon,
  MinimizeIcon,
} from "lucide-react";
import { expect, userEvent } from "storybook/test";

import { Button } from "../button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../card";
import { Field, FieldGroup, FieldLabel } from "../field";
import { Input } from "../input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";

/**
 * An interactive component which expands/collapses a panel.
 */
const meta = preview.meta({
  title: "ui/Collapsible",
  component: Collapsible,
  args: {
    className: "flex w-[350px] flex-col gap-2",
  },
  render: (args) => (
    <Collapsible {...args}>
      <CollapsibleTrigger className="flex gap-2">
        <h3 className="font-semibold">Can I use this in my project?</h3>
      </CollapsibleTrigger>
      <CollapsibleContent>
        Yes. Free to use for personal and commercial projects. No attribution
        required.
      </CollapsibleContent>
    </Collapsible>
  ),
  parameters: {
    docs: {
      description: {
        component:
          "An interactive component which expands/collapses a panel.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/collapsible) · [Base UI docs](https://base-ui.com/react/components/collapsible)",
      },
    },
  },
});

// --- Stories ---

/**
 * An order details panel that expands to reveal shipping and item
 * information.
 */
export const Default = meta.story({
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Collapsible {...args} open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between gap-4 px-4">
          <h4 className="text-sm font-semibold">Order #4189</h4>
          <CollapsibleTrigger
            render={<Button variant="ghost" size="icon" className="size-8" />}
          >
            <ChevronsUpDownIcon />
            <span className="sr-only">Toggle details</span>
          </CollapsibleTrigger>
        </div>
        <div
          className="flex items-center justify-between rounded-md border px-4
            py-2 text-sm"
        >
          <span className="text-muted-foreground">Status</span>
          <span className="font-medium">Shipped</span>
        </div>
        <CollapsibleContent className="flex flex-col gap-2">
          <div className="rounded-md border px-4 py-2 text-sm">
            <p className="font-medium">Shipping address</p>
            <p className="text-muted-foreground">
              100 Market St, San Francisco
            </p>
          </div>
          <div className="rounded-md border px-4 py-2 text-sm">
            <p className="font-medium">Items</p>
            <p className="text-muted-foreground">2x Studio Headphones</p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
});

/**
 * A product details panel with a rotating chevron indicator and a
 * call-to-action button in the expanded content.
 */
export const Basic = meta.story({
  args: {
    className: undefined,
  },
  render: (args) => (
    <Card className="mx-auto w-sm">
      <CardContent>
        <Collapsible {...args} className="data-open:bg-muted rounded-md">
          <CollapsibleTrigger
            render={<Button variant="ghost" className="w-full" />}
          >
            Product details
            <ChevronDownIcon
              className="ml-auto transition-transform
                group-data-panel-open/button:rotate-180"
            />
          </CollapsibleTrigger>
          <CollapsibleContent
            className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm"
          >
            <div>
              This panel can be expanded or collapsed to reveal additional
              content.
            </div>
            <Button size="xs">Learn More</Button>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  ),
});

/**
 * A settings panel with expandable corner radius controls.
 */
export const SettingsPanel = meta.story({
  name: "Settings Panel",
  args: {
    className: undefined,
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Card className="mx-auto w-sm" size="sm">
        <CardHeader>
          <CardTitle>Radius</CardTitle>
          <CardDescription>
            Set the corner radius of the element.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Collapsible
            {...args}
            open={isOpen}
            onOpenChange={setIsOpen}
            className="flex items-start gap-2"
          >
            <FieldGroup className="grid w-full grid-cols-2 gap-2">
              <Field>
                <FieldLabel className="sr-only">Radius X</FieldLabel>
                <Input placeholder="0" defaultValue={0} />
              </Field>
              <Field>
                <FieldLabel className="sr-only">Radius Y</FieldLabel>
                <Input placeholder="0" defaultValue={0} />
              </Field>
              <CollapsibleContent
                className="col-span-full grid grid-cols-subgrid gap-2"
              >
                <Field>
                  <FieldLabel className="sr-only">Radius X2</FieldLabel>
                  <Input placeholder="0" defaultValue={0} />
                </Field>
                <Field>
                  <FieldLabel className="sr-only">Radius Y2</FieldLabel>
                  <Input placeholder="0" defaultValue={0} />
                </Field>
              </CollapsibleContent>
            </FieldGroup>
            <CollapsibleTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Toggle details"
                />
              }
            >
              {isOpen ? <MinimizeIcon /> : <MaximizeIcon />}
            </CollapsibleTrigger>
          </Collapsible>
        </CardContent>
      </Card>
    );
  },
});

/**
 * A file tree using nested collapsible sections for folder navigation.
 */
export const FileTree = meta.story({
  name: "File Tree",
  args: {
    className: undefined,
  },
  render: (args) => {
    type FileTreeItem =
      | { name: string }
      | { name: string; items: FileTreeItem[] };

    const fileTree: FileTreeItem[] = [
      {
        name: "components",
        items: [
          {
            name: "ui",
            items: [
              { name: "button.tsx" },
              { name: "card.tsx" },
              { name: "dialog.tsx" },
            ],
          },
          { name: "login-form.tsx" },
        ],
      },
      {
        name: "lib",
        items: [{ name: "utils.ts" }, { name: "cn.ts" }],
      },
      { name: "app.tsx" },
      { name: "package.json" },
    ];

    const renderItem = (fileItem: FileTreeItem) => {
      if ("items" in fileItem) {
        return (
          <Collapsible key={fileItem.name} {...args}>
            <CollapsibleTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start transition-none"
                />
              }
            >
              <ChevronRightIcon
                className="transition-transform
                  group-data-panel-open/button:rotate-90"
              />
              <FolderIcon />
              {fileItem.name}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-1 ml-5">
              <div className="flex flex-col gap-1">
                {fileItem.items.map((child) => renderItem(child))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      }

      return (
        <Button
          key={fileItem.name}
          variant="link"
          size="sm"
          className="text-foreground w-full justify-start gap-2"
        >
          <FileIcon />
          <span>{fileItem.name}</span>
        </Button>
      );
    };

    return (
      <Card className="mx-auto w-xs gap-2" size="sm">
        <CardHeader>
          <CardTitle>Explorer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1">
            {fileTree.map((item) => renderItem(item))}
          </div>
        </CardContent>
      </Card>
    );
  },
});

// --- Tests ---

Default.test(
  "when trigger is clicked, should toggle content visibility",
  async ({ canvas, step }) => {
    const trigger = canvas.getByRole("button", { name: /toggle details/i });

    await step("Open the collapsible", async () => {
      await userEvent.click(trigger, { delay: 100 });
      await expect(
        canvas.getByText("100 Market St, San Francisco")
      ).toBeVisible();
    });

    await step("Close the collapsible", async () => {
      await userEvent.click(trigger, { delay: 100 });
      await expect(
        canvas.queryByText("100 Market St, San Francisco")
      ).toBeNull();
    });
  }
);

Default.test(
  "when trigger is activated with keyboard, should toggle content",
  async ({ canvas, step }) => {
    const trigger = canvas.getByRole("button", { name: /toggle details/i });

    await step("Open with Enter key", async () => {
      trigger.focus();
      await userEvent.keyboard("{Enter}");
      await expect(
        canvas.getByText("100 Market St, San Francisco")
      ).toBeVisible();
    });

    await step("Close with Space key", async () => {
      await userEvent.keyboard(" ");
      await expect(
        canvas.queryByText("100 Market St, San Francisco")
      ).toBeNull();
    });
  }
);

FileTree.test(
  "when folder is clicked, should expand to show nested children",
  async ({ canvas, step }) => {
    await step("Expand components folder", async () => {
      const componentsButton = canvas.getByRole("button", {
        name: /components/i,
      });
      await userEvent.click(componentsButton, { delay: 100 });
      await expect(canvas.getByRole("button", { name: /ui/i })).toBeVisible();
    });

    await step("Expand nested ui folder", async () => {
      const uiButton = canvas.getByRole("button", { name: /ui/i });
      await userEvent.click(uiButton, { delay: 100 });
      await expect(canvas.getByText("button.tsx")).toBeVisible();
    });
  }
);
