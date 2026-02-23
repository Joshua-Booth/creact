import type { VariantProps } from "class-variance-authority";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

/** Empty state placeholder displayed when a section has no content. Centers its children with a dashed border and balanced text. */
function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        `flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4
        rounded-lg border-dashed p-12 text-center text-balance`,
        className
      )}
      {...props}
    />
  );
}

/** Container for the icon, title, and description at the top of an Empty state. */
function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn("flex max-w-sm flex-col items-center gap-2", className)}
      {...props}
    />
  );
}

/** Style variants for the {@link EmptyMedia} component. */
const emptyMediaVariants = cva(
  `mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none
  [&_svg]:shrink-0`,
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: `bg-muted text-foreground flex size-10 shrink-0 items-center
        justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6`,
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/** Icon or illustration slot within an Empty state header. */
function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  );
}

/** Primary heading text for an Empty state. Supports `render` for polymorphic element. */
function EmptyTitle({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      { className: cn("text-lg font-medium tracking-tight", className) },
      props
    ),
    render,
    state: { slot: "empty-title" },
  });
}

/** Secondary descriptive text for an Empty state. */
function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        `text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed
        [&>a]:underline [&>a]:underline-offset-4`,
        className
      )}
      {...props}
    />
  );
}

/** Action area below the header in an Empty state, typically containing buttons or links. */
function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        `flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm
        text-balance`,
        className
      )}
      {...props}
    />
  );
}

export {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
};
