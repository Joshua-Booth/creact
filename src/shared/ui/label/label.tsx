"use client";

import * as React from "react";

import { cn } from "@/shared/lib/utils";

/** Accessible form label associated with a control via htmlFor. Wraps `@base-ui/react/field`. */
function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control -- generic label component receives control via props spread
    <label
      data-slot="label"
      className={cn(
        `flex items-center gap-2 text-sm leading-none font-medium select-none
        group-data-[disabled=true]:pointer-events-none
        group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed
        peer-disabled:opacity-50`,
        className
      )}
      {...props}
    />
  );
}

export { Label };
