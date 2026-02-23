import * as React from "react";

import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";

/** One-time password input with individual character slots. Built on input-otp. */
function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "cn-input-otp flex items-center has-disabled:opacity-50",
        containerClassName
      )}
      spellCheck={false}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

/** Groups adjacent OTP slots into a visually connected row. */
function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn(
        `has-aria-invalid:border-destructive
        has-aria-invalid:ring-destructive/20
        dark:has-aria-invalid:ring-destructive/40 flex items-center rounded-md
        has-aria-invalid:ring-3`,
        className
      )}
      {...props}
    />
  );
}

/** Single character cell within an OTP input group. */
function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = React.use(OTPInputContext);
  /* istanbul ignore start @preserve -- Defensive fallback: slot always exists for valid index */
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index] ?? {};
  /* istanbul ignore end @preserve */

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        `border-input aria-invalid:border-destructive
        data-[active=true]:border-ring data-[active=true]:ring-ring/50
        data-[active=true]:aria-invalid:border-destructive
        data-[active=true]:aria-invalid:ring-destructive/20 dark:bg-input/30
        dark:data-[active=true]:aria-invalid:ring-destructive/40 relative flex
        size-9 items-center justify-center border-y border-r text-sm shadow-xs
        transition-all outline-none first:rounded-l-md first:border-l
        last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-3`,
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div
          className="pointer-events-none absolute inset-0 flex items-center
            justify-center"
        >
          <div
            className="animate-caret-blink bg-foreground h-4 w-px duration-1000"
          />
        </div>
      )}
    </div>
  );
}

/** Visual divider rendered between OTP slot groups. */
function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      className="flex items-center [&_svg:not([class*='size-'])]:size-4"
      role="separator"
      {...props}
    >
      <MinusIcon />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
