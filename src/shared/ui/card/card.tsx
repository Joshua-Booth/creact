import * as React from "react";

import { cn } from "@/shared/lib/utils";

/** Styled container for grouping related content with consistent padding and borders. */
function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        `ring-foreground/10 bg-card text-card-foreground group/card flex
        flex-col gap-6 overflow-hidden rounded-xl py-6 text-sm shadow-xs ring-1
        has-[>img:first-child]:pt-0 data-[size=sm]:gap-4 data-[size=sm]:py-4
        *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl`,
        className
      )}
      {...props}
    />
  );
}

/** Header area containing the title, description, and optional action slot. */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        `group/card-header @container/card-header grid auto-rows-min items-start
        gap-1 rounded-t-xl px-6 group-data-[size=sm]/card:px-4
        has-data-[slot=card-action]:grid-cols-[1fr_auto]
        has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-6
        group-data-[size=sm]/card:[.border-b]:pb-4`,
        className
      )}
      {...props}
    />
  );
}

/** Primary heading rendered inside a card header. */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-base/normal font-medium group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  );
}

/** Secondary text rendered below the card title. */
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

/** Action slot positioned in the top-right of the card header. */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

/** Main body area of the card for arbitrary content. */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 group-data-[size=sm]/card:px-4", className)}
      {...props}
    />
  );
}

/** Bottom area of the card, typically used for action buttons. */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        `flex items-center rounded-b-xl px-6 group-data-[size=sm]/card:px-4
        [.border-t]:pt-6 group-data-[size=sm]/card:[.border-t]:pt-4`,
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
