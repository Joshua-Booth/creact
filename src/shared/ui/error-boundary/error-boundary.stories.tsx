import { useState } from "react";

import { withI18n } from "@/storybook/decorators/with-i18n";
import preview from "@/storybook/preview";
import { AlertTriangle, RefreshCw, WifiOff } from "lucide-react";
import { expect, userEvent } from "storybook/test";

import { Button } from "../button";
import { ErrorBoundary } from "./error-boundary";

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

function ErrorBoundaryDemo() {
  const [shouldThrow, setShouldThrow] = useState(false);
  const [key, setKey] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4">
      <ErrorBoundary key={key}>
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

function CustomFallbackDemo() {
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
      <ErrorBoundary key={key} fallback={customFallback}>
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
});

// --- Stories ---

/**
 * The default error boundary behavior. Click "Trigger Error" to see the
 * fallback UI, then use "Try again" or "Reset" to recover.
 */
export const Default = meta.story({
  args: { children: null },
  render: function Render(_args) {
    return <ErrorBoundaryDemo />;
  },
});

/**
 * ErrorBoundary with a custom fallback component passed via the `fallback` prop.
 */
export const CustomFallback = meta.story({
  args: { children: null },
  render: function Render(_args) {
    return <CustomFallbackDemo />;
  },
});

/**
 * A preview of the default fallback UI that displays when an error is caught.
 */
export const DefaultFallbackPreview = meta.story({
  args: { children: null },
  render: (_args) => (
    <div className="flex min-h-96 flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="bg-destructive/10 rounded-full p-4">
          <AlertTriangle className="text-destructive size-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="text-muted-foreground max-w-md">
            An unexpected error occurred. Our team has been notified and is
            working on a fix.
          </p>
        </div>
        <Button variant="outline" className="mt-4">
          <RefreshCw className="mr-2 size-4" />
          Try again
        </Button>
      </div>
    </div>
  ),
});

/**
 * A compact error fallback style for smaller spaces.
 */
export const CompactFallbackPreview = meta.story({
  args: { children: null },
  render: (_args) => (
    <div className="flex items-center gap-3 rounded-md border p-4">
      <AlertTriangle className="text-destructive size-5" />
      <div className="flex-1">
        <p className="text-sm font-medium">Failed to load content</p>
        <p className="text-muted-foreground text-xs">
          An error occurred while loading.
        </p>
      </div>
      <Button variant="ghost" size="sm">
        Retry
      </Button>
    </div>
  ),
});

function ErrorBoundaryTestDemo({
  onTrigger,
  onReset,
}: {
  onTrigger?: () => void;
  onReset?: () => void;
}) {
  const [shouldThrow, setShouldThrow] = useState(false);
  const [key, setKey] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4">
      <ErrorBoundary key={key}>
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
    render: function Render(_args) {
      return <ErrorBoundaryTestDemo />;
    },
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
    render: function Render(_args) {
      return <ErrorBoundaryTestDemo />;
    },
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
