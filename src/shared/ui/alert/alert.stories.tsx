import preview from "@/storybook/preview";
import { AlertCircle, AlertTriangleIcon, Terminal } from "lucide-react";
import { expect, userEvent } from "storybook/test";

import { Button } from "../button";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "./alert";

/**
 * Displays a callout for user attention.
 */
const meta = preview.meta({
  title: "ui/Alert",
  component: Alert,
  argTypes: {
    variant: {
      options: ["default", "destructive"],
      control: { type: "radio" },
    },
  },
  args: {
    variant: "default",
  },
  render: (args) => (
    <Alert {...args}>
      <Terminal className="size-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        component:
          "Displays a callout for user attention.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/alert)",
      },
    },
  },
});

// --- Stories ---

/**
 * The default form of the alert.
 */
export const Default = meta.story();

/**
 * Use the `destructive` alert to indicate a destructive action.
 */
export const Destructive = meta.story({
  render: (args) => (
    <Alert {...args}>
      <AlertCircle className="size-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  ),
  args: {
    variant: "destructive",
  },
});

/**
 * Use `AlertAction` to add an interactive element to the alert.
 */
export const Action = meta.story({
  render: (args) => (
    <Alert {...args} className="max-w-md">
      <AlertTitle>Dark mode is now available</AlertTitle>
      <AlertDescription>
        Enable it under your profile settings to get started.
      </AlertDescription>
      <AlertAction>
        <Button size="xs" variant="default">
          Enable
        </Button>
      </AlertAction>
    </Alert>
  ),
});

/**
 * Use custom Tailwind classes to create alerts with different color schemes.
 */
export const Colors = meta.story({
  render: (args) => (
    <Alert
      {...args}
      className="max-w-md border-amber-200 bg-amber-50 text-amber-900
        dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50"
    >
      <AlertTriangleIcon />
      <AlertTitle>Your subscription will expire in 3 days.</AlertTitle>
      <AlertDescription>
        Renew now to avoid service interruption or upgrade to a paid plan to
        continue using the service.
      </AlertDescription>
    </Alert>
  ),
});

// --- Tests ---

Action.test("action button should be clickable", async ({ canvas }) => {
  const button = await canvas.findByRole("button", { name: /enable/i });
  await expect(button).toBeEnabled();
  await userEvent.click(button);
});
