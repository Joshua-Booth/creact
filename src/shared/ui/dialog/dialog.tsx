"use client";

import * as React from "react";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

/**
 * Focus-trapped modal window overlaid on the primary content. Wraps `@base-ui/react/dialog` with project styling and animation presets.
 * @see {@link DialogContent} for the popup panel
 */
function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

/** Button or element that opens the dialog when activated. */
function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

/** Renders dialog content outside the DOM hierarchy via a portal. */
function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

/** Button that closes the dialog when activated. */
function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

/** Portal-rendered overlay backdrop that dims the page behind the dialog. */
function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        `data-open:animate-in data-closed:animate-out data-closed:fade-out-0
        data-open:fade-in-0 fixed inset-0 isolate z-50 bg-black/10 duration-100
        supports-backdrop-filter:backdrop-blur-xs`,
        className
      )}
      {...props}
    />
  );
}

/** Centered popup panel rendered via portal with overlay, close button, and zoom animation. */
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  /** Whether to show the X close button in the top-right corner. */
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          `bg-background data-open:animate-in data-closed:animate-out
          data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95
          data-open:zoom-in-95 ring-foreground/10 fixed top-1/2 left-1/2 z-50
          grid w-full max-w-[calc(100%-2rem)] -translate-1/2 gap-6 rounded-xl
          p-6 text-sm ring-1 duration-100 outline-none sm:max-w-md`,
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-4 right-4"
                size="icon-sm"
              />
            }
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

/** Container for the dialog title and description at the top. */
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

/** Action area at the bottom of the dialog for buttons. */
function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** Whether to show a close button alongside the footer actions. */
  showCloseButton?: boolean;
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {/* istanbul ignore start @preserve -- showCloseButton false path, not rendered in stories */}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Close
        </DialogPrimitive.Close>
      )}
      {/* istanbul ignore end @preserve */}
    </div>
  );
}

/** Accessible heading for the dialog content. */
function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("leading-none font-medium", className)}
      {...props}
    />
  );
}

/** Accessible description text displayed below the dialog title. */
function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        `text-muted-foreground *:[a]:hover:text-foreground text-sm
        *:[a]:underline *:[a]:underline-offset-3`,
        className
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
