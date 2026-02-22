import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";

import { cn } from "@/shared/lib/utils";

/** Visual divider rendered as a horizontal or vertical line. Defaults to horizontal orientation. */
function Separator({
  className,
  orientation = "horizontal",
  role,
  ...props
}: SeparatorPrimitive.Props) {
  // WAI-ARIA: role="presentation" elements must not have aria-orientation.
  // base-ui always sets it from orientation, so strip when presentational.
  // Only forward role when explicitly set to preserve base-ui's default.
  let roleProps: Record<string, unknown> | undefined;
  if (role === "presentation" || role === "none") {
    roleProps = { role, "aria-orientation": undefined };
  } else if (role != null) {
    roleProps = { role };
  }

  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      {...roleProps}
      className={cn(
        `bg-border shrink-0 data-[orientation=horizontal]:h-px
        data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px
        data-[orientation=vertical]:self-stretch`,
        className
      )}
      {...props}
    />
  );
}

export { Separator };
