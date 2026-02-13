"use client";

import * as React from "react";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";
import { toggleVariants } from "@/shared/ui/toggle";

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    spacing?: number;
    orientation?: "horizontal" | "vertical";
  }
>({
  size: "default",
  variant: "default",
  spacing: 0,
  orientation: "horizontal",
});

/** Container for a group of related toggle buttons. Propagates shared variant, size, spacing, and orientation to child items via context. */
function ToggleGroup({
  className,
  variant,
  size,
  spacing = 0,
  orientation = "horizontal",
  children,
  ...props
}: ToggleGroupPrimitive.Props &
  VariantProps<typeof toggleVariants> & {
    spacing?: number;
    orientation?: "horizontal" | "vertical";
  }) {
  const contextValue = React.useMemo(
    () => ({ variant, size, spacing, orientation }),
    [variant, size, spacing, orientation]
  );

  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-spacing={spacing}
      data-orientation={orientation}
      style={{ "--gap": spacing } as React.CSSProperties}
      className={cn(
        `group/toggle-group flex w-fit flex-row items-center
        gap-[--spacing(var(--gap))] rounded-md data-vertical:flex-col
        data-vertical:items-stretch
        data-[spacing=0]:data-[variant=outline]:shadow-xs`,
        className
      )}
      {...props}
    >
      <ToggleGroupContext value={contextValue}>{children}</ToggleGroupContext>
    </ToggleGroupPrimitive>
  );
}

/** Individual toggle button within a `ToggleGroup`. Inherits variant and size from the group context. */
function ToggleGroupItem({
  className,
  children,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  const context = React.use(ToggleGroupContext);

  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      /* v8 ignore start -- Context always provides variant/size in stories */
      data-variant={context.variant ?? variant}
      data-size={context.size ?? size}
      /* v8 ignore stop */
      data-spacing={context.spacing}
      className={cn(
        `data-[state=on]:bg-muted shrink-0
        group-data-[spacing=0]/toggle-group:rounded-none
        group-data-[spacing=0]/toggle-group:px-2
        group-data-[spacing=0]/toggle-group:shadow-none focus:z-10
        focus-visible:z-10
        group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-md
        group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-md
        group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-md
        group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-md
        group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0
        group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0
        group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l
        group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t`,
        /* v8 ignore next 4 -- Context always provides variant/size in stories */
        toggleVariants({
          variant: context.variant ?? variant,
          size: context.size ?? size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </TogglePrimitive>
  );
}

export { ToggleGroup, ToggleGroupItem };
