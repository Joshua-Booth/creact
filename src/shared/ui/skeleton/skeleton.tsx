import { cn } from "@/shared/lib/utils";

/** Animated placeholder that indicates content is loading. Renders a pulsing rounded rectangle. */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-muted animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
