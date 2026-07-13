import * as React from "react";

import type { VariantProps } from "class-variance-authority";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

/** Style variants for the {@link Marker} component. */
const markerVariants = cva(
  `text-muted-foreground relative flex min-h-4 w-full items-center gap-2
  text-left text-sm [&_svg:not([class*='size-'])]:size-4 [a]:underline
  [a]:underline-offset-3 [a]:hover:text-foreground`,
  {
    variants: {
      variant: {
        default: "",
        separator: `before:mr-1 before:h-px before:min-w-0 before:flex-1
        before:bg-border after:ml-1 after:h-px after:min-w-0 after:flex-1
        after:bg-border`,
        border: "border-border border-b pb-2",
      },
    },
  }
);

/**
 * Inline status line for conversations, such as date separators or system
 * events; renders as any element via `render`.
 * @see {@link markerVariants} for available variant options
 */
function Marker({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof markerVariants>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(markerVariants({ variant, className })),
      },
      props
    ),
    render,
    state: {
      slot: "marker",
      variant,
    },
  });
}

/** Decorative icon container displayed at the start of a marker. */
function MarkerIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-icon"
      aria-hidden="true"
      className={cn(
        "size-4 shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

/** Text content of a marker. */
function MarkerContent({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-content"
      className={cn(
        `*:[a]:hover:text-foreground min-w-0 wrap-break-word
        group-data-[variant=separator]/marker:flex-none
        group-data-[variant=separator]/marker:text-center *:[a]:underline
        *:[a]:underline-offset-3`,
        className
      )}
      {...props}
    />
  );
}

export { Marker, MarkerContent, MarkerIcon, markerVariants };
