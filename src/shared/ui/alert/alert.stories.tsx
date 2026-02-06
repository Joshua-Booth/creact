import preview from "@/storybook/preview";
import { AlertCircle, Terminal } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "./alert";

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
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  ),
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
 * Use a leading icon to draw attention to the alert.
 */
export const WithIcon = meta.story({
  render: (args) => (
    <Alert {...args}>
      <Terminal className="size-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  ),
});
