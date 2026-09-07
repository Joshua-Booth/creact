import { cn } from "cn";
import i18next from "i18next";
import { Loader2Icon } from "lucide-react";

/** Animated loading spinner icon with an accessible translated label. */
function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      role="status"
      aria-label={i18next.t("loading")}
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
