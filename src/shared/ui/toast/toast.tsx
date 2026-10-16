"use client";

import { useSyncExternalStore } from "react";

import type { ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner } from "sonner";

// The theme's dark tokens key off `.dark` on <html>, so the toaster follows
// that class rather than one theme library's provider.
function subscribeToRootClass(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

const rootTheme = () =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";

/** Themed toast notification renderer powered by Sonner. Follows the `.dark` class on the document root and provides custom status icons. */
function Toaster({ ...props }: ToasterProps) {
  const theme = useSyncExternalStore(
    subscribeToRootClass,
    rootTheme,
    /* istanbul ignore next -- SSR-only snapshot, never called in browser tests */
    () => "system" as const
  );

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
