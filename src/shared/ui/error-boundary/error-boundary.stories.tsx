import { useState } from "react";

import type { ComponentProps } from "react";
import { withI18n } from "@/storybook/decorators/with-i18n";
import preview from "@/storybook/preview";
import { RefreshCw, WifiOff } from "lucide-react";
import { expect, userEvent } from "storybook/test";

import { Button } from "../button";
import { ErrorBoundary } from "./error-boundary";

type ErrorBoundaryProps = ComponentProps<typeof ErrorBoundary>;

// --- Helpers ---

function BuggyComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("This is a simulated error for demonstration purposes");
  }
  return (
    <div className="rounded-md border p-8 text-center">
      <p className="text-muted-foreground">
        This content is wrapped in an ErrorBoundary and renders normally.
      </p>
    </div>
  );
}

function ErrorBoundaryDemo(args: ErrorBoundaryProps) {
  const [shouldThrow, setShouldThrow] = useState(false);
  const [key, setKey] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4">
      <ErrorBoundary key={key} {...args}>
        <BuggyComponent shouldThrow={shouldThrow} />
      </ErrorBoundary>
      <div className="flex gap-2">
        <Button
          variant="destructive"
          onClick={() => setShouldThrow(true)}
          disabled={shouldThrow}
        >
          Trigger Error
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setShouldThrow(false);
            setKey((k) => k + 1);
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}

function CustomFallbackDemo(args: ErrorBoundaryProps) {
  const [shouldThrow, setShouldThrow] = useState(false);
  const [key, setKey] = useState(0);

  const customFallback = (
    <div className="flex min-h-96 flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="bg-muted rounded-full p-4">
          <WifiOff className="text-muted-foreground size-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Connection lost</h2>
          <p className="text-muted-foreground max-w-md">
            Please check your internet connection and try again.
          </p>
        </div>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {
            setShouldThrow(false);
            setKey((k) => k + 1);
          }}
        >
          <RefreshCw className="mr-2 size-4" />
          Reconnect
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <ErrorBoundary key={key} {...args} fallback={customFallback}>
        <BuggyComponent shouldThrow={shouldThrow} />
      </ErrorBoundary>
      <Button
        variant="destructive"
        onClick={() => setShouldThrow(true)}
        disabled={shouldThrow}
      >
        Trigger Error
      </Button>
    </div>
  );
}

/**
 * Catches JavaScript errors in child components and displays a fallback UI.
 */
const meta = preview.meta({
  title: "ui/ErrorBoundary",
  component: ErrorBoundary,
  decorators: [withI18n],
  parameters: {
    docs: {
      description: {
        component:
          "Catches JavaScript errors in child components and displays a fallback UI.",
      },
    },
  },
});

// --- Stories ---

/**
 * The default error boundary behavior. Click "Trigger Error" to see the
 * fallback UI, then use "Try again" or "Reset" to recover.
 */
export const Default = meta.story({
  args: { children: null },
  render: (args) => <ErrorBoundaryDemo {...args} />,
});

/**
 * ErrorBoundary with a custom fallback component passed via the `fallback` prop.
 */
export const CustomFallback = meta.story({
  args: { children: null },
  render: (args) => <CustomFallbackDemo {...args} />,
});

function ErrorBoundaryTestDemo(
  args: ErrorBoundaryProps & {
    onTrigger?: () => void;
    onReset?: () => void;
  }
) {
  const { onTrigger, onReset, ...boundaryArgs } = args;
  const [shouldThrow, setShouldThrow] = useState(false);
  const [key, setKey] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4">
      <ErrorBoundary key={key} {...boundaryArgs}>
        <BuggyComponent shouldThrow={shouldThrow} />
      </ErrorBoundary>
      <div className="flex gap-2">
        <Button
          variant="destructive"
          onClick={() => {
            setShouldThrow(true);
            onTrigger?.();
          }}
          disabled={shouldThrow}
        >
          Trigger Error
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setShouldThrow(false);
            setKey((k) => k + 1);
            onReset?.();
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}

/**
 * When an error is triggered, should display fallback UI.
 */

// --- Tests ---

Default.test(
  "when error is triggered, should display fallback UI",
  {
    args: { children: null },
    render: (args) => <ErrorBoundaryTestDemo {...args} />,
  },
  async ({ canvas, step }) => {
    await step("verify normal content is shown initially", async () => {
      await expect(
        canvas.getByText(/This content is wrapped in an ErrorBoundary/)
      ).toBeVisible();
    });

    await step("trigger error and verify fallback is displayed", async () => {
      const triggerButton = canvas.getByRole("button", {
        name: /trigger error/i,
      });
      await userEvent.click(triggerButton);

      await expect(canvas.getByText(/something went wrong/i)).toBeVisible();
      await expect(
        canvas.getByRole("button", { name: /try again/i })
      ).toBeVisible();
    });
  }
);

/**
 * When reset is clicked after error, should recover and show normal content.
 */
Default.test(
  "when reset is clicked after error, should recover",
  {
    args: { children: null },
    render: (args) => <ErrorBoundaryTestDemo {...args} />,
  },
  async ({ canvas, step }) => {
    await step("trigger error first", async () => {
      const triggerButton = canvas.getByRole("button", {
        name: /trigger error/i,
      });
      await userEvent.click(triggerButton);
      await expect(canvas.getByText(/something went wrong/i)).toBeVisible();
    });

    await step("click reset and verify recovery", async () => {
      const resetButton = canvas.getByRole("button", { name: /reset/i });
      await userEvent.click(resetButton);

      await expect(
        canvas.getByText(/This content is wrapped in an ErrorBoundary/)
      ).toBeVisible();
    });
  }
);
