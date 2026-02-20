import * as React from "react";

import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

/**
 * Focus-trapped confirmation dialog that requires explicit user action before proceeding. Wraps `@base-ui/react/alert-dialog`.
 * @see {@link AlertDialogContent} for the popup panel
 */
function AlertDialog({ ...props }: AlertDialogPrimitive.Root.Props) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

/** Button or element that opens the alert dialog. */
function AlertDialogTrigger({ ...props }: AlertDialogPrimitive.Trigger.Props) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  );
}

/** Renders alert dialog content outside the DOM hierarchy via a portal. */
function AlertDialogPortal({ ...props }: AlertDialogPrimitive.Portal.Props) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  );
}

/** Portal-rendered overlay backdrop that dims the page behind the alert dialog. */
function AlertDialogOverlay({
  className,
  ...props
}: AlertDialogPrimitive.Backdrop.Props) {
  return (
    <AlertDialogPrimitive.Backdrop
      data-slot="alert-dialog-overlay"
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

/** Centered popup panel for confirmation prompts, rendered via portal with overlay and zoom animation. */
function AlertDialogContent({
  className,
  size = "default",
  ...props
}: AlertDialogPrimitive.Popup.Props & {
  size?: "default" | "sm";
}) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Popup
        data-slot="alert-dialog-content"
        data-size={size}
        className={cn(
          `data-open:animate-in data-closed:animate-out data-closed:fade-out-0
          data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95
          bg-background ring-foreground/10 group/alert-dialog-content fixed
          top-1/2 left-1/2 z-50 grid w-full -translate-1/2 gap-6 rounded-xl p-6
          ring-1 duration-100 outline-none data-[size=default]:max-w-xs
          data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-lg`,
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}

/** Header area for the alert dialog title, description, and optional {@link AlertDialogMedia} slot. */
function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        `grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center
        has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr]
        has-data-[slot=alert-dialog-media]:gap-x-6
        sm:group-data-[size=default]/alert-dialog-content:place-items-start
        sm:group-data-[size=default]/alert-dialog-content:text-left
        sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]`,
        className
      )}
      {...props}
    />
  );
}

/** Action area at the bottom for {@link AlertDialogAction} and {@link AlertDialogCancel} buttons. */
function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        `flex flex-col-reverse gap-2
        group-data-[size=sm]/alert-dialog-content:grid
        group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row
        sm:justify-end`,
        className
      )}
      {...props}
    />
  );
}

/* istanbul ignore start @preserve -- Optional media slot, not exercised in stories */
/** Optional media slot for icons or illustrations in the header. */
function AlertDialogMedia({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn(
        `bg-muted mb-2 inline-flex size-16 items-center justify-center
        rounded-md sm:group-data-[size=default]/alert-dialog-content:row-span-2
        *:[svg:not([class*='size-'])]:size-8`,
        className
      )}
      {...props}
    />
  );
}
/* istanbul ignore end @preserve */

/** Accessible heading for the alert dialog. */
function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn(
        `text-lg font-medium
        sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2`,
        className
      )}
      {...props}
    />
  );
}

/** Accessible description text for the alert dialog. */
function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(
        `text-muted-foreground *:[a]:hover:text-foreground text-sm text-balance
        md:text-pretty *:[a]:underline *:[a]:underline-offset-3`,
        className
      )}
      {...props}
    />
  );
}

/** Primary action button that confirms the alert dialog intent. */
function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="alert-dialog-action"
      className={cn(className)}
      {...props}
    />
  );
}

/** Cancel button that dismisses the alert dialog without action. */
function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  ...props
}: AlertDialogPrimitive.Close.Props &
  Partial<Pick<React.ComponentProps<typeof Button>, "variant" | "size">>) {
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-cancel"
      className={cn(className)}
      render={<Button variant={variant} size={size} />}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
