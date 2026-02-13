/* eslint-disable @typescript-eslint/no-non-null-assertion -- Test assertions on known DOM elements */
import preview from "@/storybook/preview";
import { Music, Settings, User } from "lucide-react";
import { expect, userEvent, waitFor } from "storybook/test";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

/**
 * A set of layered sections of content—known as tab panels—that are displayed
 * one at a time.
 */
const meta = preview.meta({
  title: "ui/Tabs",
  component: Tabs,
  argTypes: {},
  args: {
    defaultValue: "account",
    className: "w-96",
  },
  render: (args) => (
    <Tabs {...args}>
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        component:
          "A set of layered sections of content—known as tab panels—that are displayed one at a time.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/tabs)",
      },
    },
    layout: "centered",
  },
});

// --- Stories ---

/**
 * The default form of the tabs.
 */
export const Default = meta.story();

/**
 * Use `variant="line"` on the TabsList for an underlined tab style.
 */
export const Line = meta.story({
  render: (args) => (
    <Tabs {...args}>
      <TabsList variant="line">
        <TabsTrigger value="account">Overview</TabsTrigger>
        <TabsTrigger value="password">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Overview content goes here.</TabsContent>
      <TabsContent value="password">Analytics content goes here.</TabsContent>
      <TabsContent value="reports">Reports content goes here.</TabsContent>
    </Tabs>
  ),
});

/**
 * Use `orientation="vertical"` for a vertical tab layout where tabs are
 * stacked on the side.
 */
export const Vertical = meta.story({
  args: {
    orientation: "vertical",
    className: "w-[400px]",
  },
  render: (args) => (
    <Tabs {...args}>
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
      <TabsContent value="settings">Manage your settings here.</TabsContent>
    </Tabs>
  ),
});

/**
 * Add the `disabled` prop to a tab trigger to prevent interactions with
 * that tab.
 */
export const WithDisabled = meta.story({
  render: (args) => (
    <Tabs {...args}>
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password" disabled>
          Password
        </TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
      <TabsContent value="settings">Manage your settings here.</TabsContent>
    </Tabs>
  ),
});

/**
 * Add icons to tab triggers to enhance visual communication and provide
 * additional context for each tab.
 */
export const WithIcons = meta.story({
  render: (args) => (
    <Tabs {...args}>
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="account">
          <User />
          Account
        </TabsTrigger>
        <TabsTrigger value="password">
          <Settings />
          Password
        </TabsTrigger>
        <TabsTrigger value="music">
          <Music />
          Music
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
      <TabsContent value="music">Manage your music library here.</TabsContent>
    </Tabs>
  ),
});

// --- Tests ---

Default.test(
  "when using arrow keys, should navigate between tabs",
  async ({ canvas, step }) => {
    const tabs = await canvas.findAllByRole("tab");

    await step("focus the first tab", async () => {
      await userEvent.click(tabs[0]!);
      await expect(tabs[0]).toHaveFocus();
    });

    await step("press ArrowRight to move to next tab", async () => {
      await userEvent.keyboard("{ArrowRight}");
      await waitFor(() => expect(tabs[1]).toHaveFocus());
    });

    await step("press ArrowLeft to move back", async () => {
      await userEvent.keyboard("{ArrowLeft}");
      await waitFor(() => expect(tabs[0]).toHaveFocus());
    });
  }
);

Default.test(
  "when clicking a tab, should change the content",
  async ({ canvas, step }) => {
    const tabs = await canvas.findAllByRole("tab");

    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i]!;
      await step(`click the '${tab.innerText}' tab`, async () => {
        await userEvent.click(tab);
        await waitFor(() =>
          expect(tab).toHaveAttribute("aria-selected", "true")
        );
        await expect(
          canvas.queryByRole("tabpanel", { name: tab.innerText })
        ).toBeVisible();
      });

      await step("check other tabs are not selected", async () => {
        for (let j = 0; j < tabs.length; j++) {
          if (j !== i) {
            const otherTab = tabs[j]!;
            await expect(otherTab).toHaveAttribute("aria-selected", "false");
            await expect(
              canvas.queryByRole("tabpanel", { name: otherTab.innerText })
            ).toBeNull();
          }
        }
      });
    }
  }
);
