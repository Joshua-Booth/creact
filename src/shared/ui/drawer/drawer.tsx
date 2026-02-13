"use client";

import * as React from "react";

import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@/shared/lib/utils";

/**
 * Touch-friendly bottom sheet overlay powered by Vaul. Supports swipe-to-dismiss and directional rendering.
 */
function Drawer({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

/** Button or element that opens the drawer. */
function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

/** Portal container for drawer content rendering. */
function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

/** Button that closes the drawer when activated. */
function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

/** Semi-transparent backdrop behind the drawer that dims the page. */
function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        `data-open:animate-in data-closed:animate-out data-closed:fade-out-0
        data-open:fade-in-0 fixed inset-0 z-50 bg-black/10
        supports-backdrop-filter:backdrop-blur-xs`,
        className
      )}
      {...props}
    />
  );
}

/** Sliding panel with a drag handle for bottom sheets and directional support. */
function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          `bg-background group/drawer-content fixed z-50 flex h-auto flex-col
          text-sm data-[vaul-drawer-direction=bottom]:inset-x-0
          data-[vaul-drawer-direction=bottom]:bottom-0
          data-[vaul-drawer-direction=bottom]:mt-24
          data-[vaul-drawer-direction=bottom]:max-h-[80vh]
          data-[vaul-drawer-direction=bottom]:rounded-t-xl
          data-[vaul-drawer-direction=bottom]:border-t
          data-[vaul-drawer-direction=left]:inset-y-0
          data-[vaul-drawer-direction=left]:left-0
          data-[vaul-drawer-direction=left]:w-3/4
          data-[vaul-drawer-direction=left]:rounded-r-xl
          data-[vaul-drawer-direction=left]:border-r
          data-[vaul-drawer-direction=right]:inset-y-0
          data-[vaul-drawer-direction=right]:right-0
          data-[vaul-drawer-direction=right]:w-3/4
          data-[vaul-drawer-direction=right]:rounded-l-xl
          data-[vaul-drawer-direction=right]:border-l
          data-[vaul-drawer-direction=top]:inset-x-0
          data-[vaul-drawer-direction=top]:top-0
          data-[vaul-drawer-direction=top]:mb-24
          data-[vaul-drawer-direction=top]:max-h-[80vh]
          data-[vaul-drawer-direction=top]:rounded-b-xl
          data-[vaul-drawer-direction=top]:border-b
          data-[vaul-drawer-direction=left]:sm:max-w-sm
          data-[vaul-drawer-direction=right]:sm:max-w-sm`,
          className
        )}
        {...props}
      >
        <div
          className="bg-muted mx-auto mt-4 hidden h-1.5 w-[100px] shrink-0
            rounded-full
            group-data-[vaul-drawer-direction=bottom]/drawer-content:block"
        />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

/** Top section of the drawer for title and description. */
function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        `flex flex-col gap-0.5 p-4
        group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center
        group-data-[vaul-drawer-direction=top]/drawer-content:text-center
        md:gap-1.5 md:text-left`,
        className
      )}
      {...props}
    />
  );
}

/** Bottom section of the drawer for action buttons. */
function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

/** Accessible heading for the drawer content. */
function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-foreground font-medium", className)}
      {...props}
    />
  );
}

/** Accessible description text displayed below the drawer title. */
function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
};
