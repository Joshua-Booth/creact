import { useState } from "react";

import preview from "@/storybook/preview";
import { Theme, ThemeProvider } from "remix-themes";
import { action } from "storybook/actions";
import { expect, userEvent, waitFor, within } from "storybook/test";

import type { ToasterProps } from ".";
import { toast, Toaster } from ".";
import { Button } from "../button";

/**
 * An opinionated toast component for React.
 */
const meta = preview.meta({
  title: "ui/Toast",
  component: Toaster,
  argTypes: {},
  args: {
    position: "bottom-right",
  },
  decorators: [
    (Story) => (
      <ThemeProvider
        specifiedTheme={Theme.LIGHT}
        themeAction="/action/set-theme"
      >
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <div className="flex min-h-96 items-center justify-center space-x-2">
      <Button
        onClick={() =>
          toast("Event has been created", {
            description: new Date().toLocaleString(),
            action: {
              label: "Undo",
              onClick: action("Undo clicked"),
            },
          })
        }
      >
        Show Toast
      </Button>
      <Toaster {...args} />
    </div>
  ),
});

// --- Stories ---

/**
 * The default form of the toast.
 */
export const Default = meta.story();

/**
 * Toast types for different states and feedback.
 */
export const Types = meta.story({
  render: (args) => (
    <div className="flex min-h-96 items-center justify-center">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => toast("Event has been created")}
        >
          Default
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.success("Event has been created")}
        >
          Success
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.info("Be at the area 10 minutes before the event time")
          }
        >
          Info
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.warning("Event start time cannot be earlier than 8am")
          }
        >
          Warning
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.error("Event has not been created")}
        >
          Error
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.promise(
              new globalThis.Promise((resolve) => setTimeout(resolve, 2000)),
              {
                loading: "Loading...",
                success: "Event has been created",
                error: "Error creating event",
              }
            )
          }
        >
          Promise
        </Button>
      </div>
      <Toaster {...args} />
    </div>
  ),
});

/**
 * A toast with additional description text.
 */
export const Description = meta.story({
  render: (args) => (
    <div className="flex min-h-96 items-center justify-center">
      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been created", {
            description: "Monday, January 3rd at 6:00pm",
          })
        }
      >
        Show Toast
      </Button>
      <Toaster {...args} />
    </div>
  ),
});

/**
 * Toast position options.
 */
export const Position = meta.story({
  render: (_args) => {
    const [position, setPosition] =
      useState<ToasterProps["position"]>("bottom-right");

    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setPosition("top-left");
              toast("Event has been created", { position: "top-left" });
            }}
          >
            Top Left
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setPosition("top-center");
              toast("Event has been created", { position: "top-center" });
            }}
          >
            Top Center
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setPosition("top-right");
              toast("Event has been created", { position: "top-right" });
            }}
          >
            Top Right
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setPosition("bottom-left");
              toast("Event has been created", { position: "bottom-left" });
            }}
          >
            Bottom Left
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setPosition("bottom-center");
              toast("Event has been created", { position: "bottom-center" });
            }}
          >
            Bottom Center
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setPosition("bottom-right");
              toast("Event has been created", { position: "bottom-right" });
            }}
          >
            Bottom Right
          </Button>
        </div>
        <Toaster position={position} />
      </div>
    );
  },
});

// --- Tests ---

Default.test(
  "when clicking Show Toast button, should show a toast",
  async ({ canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);
    const triggerBtn = await canvasBody.findByRole("button", {
      name: /show/i,
    });

    await step("create a toast", async () => {
      await userEvent.click(triggerBtn);
      await waitFor(() =>
        expect(canvasBody.queryByRole("listitem")).toBeInTheDocument()
      );
    });

    await step("create more toasts", async () => {
      await userEvent.click(triggerBtn);
      await userEvent.click(triggerBtn);
      await waitFor(() =>
        expect(canvasBody.getAllByRole("listitem")).toHaveLength(3)
      );
    });
  }
);

Default.test(
  "when clicking the close button, should close the toast",
  async ({ canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);
    const triggerBtn = await canvasBody.findByRole("button", {
      name: /show/i,
    });

    await step("create a toast", async () => {
      await userEvent.click(triggerBtn);
    });

    await step("close the toast", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /undo/i })
      );
      await waitFor(() =>
        expect(canvasBody.queryByRole("listitem")).not.toBeInTheDocument()
      );
    });
  }
);
