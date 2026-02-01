import type { Meta, StoryObj } from "@storybook/react-vite";

import { Music, Settings, User } from "lucide-react";
import { expect, userEvent, waitFor } from "storybook/test";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

/**
 * A set of layered sections of content—known as tab panels—that are displayed
 * one at a time.
 */
const meta = {
  title: "ui/Tabs",
  component: Tabs,
  tags: ["autodocs"],
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
    layout: "centered",
  },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the tabs.
 */
export const Default: Story = {};

/**
 * Use `variant="line"` on the TabsList for an underlined tab style.
 */
export const Line: Story = {
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
};

/**
 * Use `orientation="vertical"` for a vertical tab layout where tabs are
 * stacked on the side.
 */
export const Vertical: Story = {
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
};

/**
 * Add the `disabled` prop to a tab trigger to prevent interactions with
 * that tab.
 */
export const WithDisabled: Story = {
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
};

/**
 * Add icons to tab triggers to enhance visual communication and provide
 * additional context for each tab.
 */
export const WithIcons: Story = {
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
};

export const ShouldChangeTabs: Story = {
  name: "when clicking a tab, should change the content",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvas, step }) => {
    const tabs = await canvas.findAllByRole("tab");

    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i]!;
      await step(`click the '${tab.innerText}' tab`, async () => {
        await userEvent.click(tab);
        await waitFor(() =>
          expect(tab).toHaveAttribute("aria-selected", "true")
        );
        await expect(
          await canvas.queryByRole("tabpanel", { name: tab.innerText })
        ).toBeVisible();
      });

      await step("check other tabs are not selected", async () => {
        for (let j = 0; j < tabs.length; j++) {
          if (j !== i) {
            const otherTab = tabs[j]!;
            expect(otherTab).toHaveAttribute("aria-selected", "false");
            expect(
              await canvas.queryByRole("tabpanel", { name: otherTab.innerText })
            ).toBeNull();
          }
        }
      });
    }
  },
};
