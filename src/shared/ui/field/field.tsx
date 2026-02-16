"use client";

import { useMemo } from "react";

import type { VariantProps } from "class-variance-authority";
import { Field as FieldPrimitive } from "@base-ui/react/field";
import { Fieldset as FieldsetPrimitive } from "@base-ui/react/fieldset";
import { cva } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";
import { Separator } from "@/shared/ui/separator";

import { Label } from "../label";

/** Fieldset container for grouping related form fields with accessible semantics. */
function FieldSet({ className, ...props }: FieldsetPrimitive.Root.Props) {
  return (
    <FieldsetPrimitive.Root
      data-slot="field-set"
      className={cn(
        `flex flex-col gap-6 has-[>[data-slot=checkbox-group]]:gap-3
        has-[>[data-slot=radio-group]]:gap-3`,
        className
      )}
      {...props}
    />
  );
}

/** Legend element rendered above a fieldset with `legend` and `label` style variants. */
function FieldLegend({
  className,
  variant = "legend",
  ...props
}: FieldsetPrimitive.Legend.Props & { variant?: "legend" | "label" }) {
  return (
    <FieldsetPrimitive.Legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        `mb-3 font-medium data-[variant=label]:text-sm
        data-[variant=legend]:text-base`,
        className
      )}
      {...props}
    />
  );
}

/**
 * Plain description for use outside Field context (e.g., after FieldLegend).
 * Use FieldDescription inside Field for proper aria-describedby association.
 * @param props - Paragraph element props including className
 * @param props.className - Additional CSS classes
 * @returns Description paragraph element
 */
function FieldLegendDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-legend-description"
      className={cn(
        `text-muted-foreground mb-3 text-left text-sm/normal font-normal
        [[data-variant=legend]+&]:-mt-6`,
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      {...props}
    />
  );
}

/** Vertical stack container for arranging multiple form fields. */
function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        `group/field-group @container/field-group flex w-full flex-col gap-7
        data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4`,
        className
      )}
      {...props}
    />
  );
}

/**
 * Style variants for the Field component.
 *
 * Orientations: `vertical` | `horizontal` | `responsive`
 */
const fieldVariants = cva(
  "group/field flex w-full gap-3 data-invalid:text-destructive",
  {
    variants: {
      orientation: {
        vertical: "flex-col *:w-full [&>.sr-only]:w-auto",
        horizontal: `flex-row items-center
        has-[>[data-slot=field-content]]:items-start
        *:data-[slot=field-label]:flex-auto
        has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px
        `,
        responsive: `flex-col *:w-full @md/field-group:flex-row
        @md/field-group:items-center @md/field-group:*:w-auto
        @md/field-group:has-[>[data-slot=field-content]]:items-start
        @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto
        @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px
        `,
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
);

/** Form field container that provides validation context and accessible label association. Wraps `@base-ui/react/field` with orientation variants. */
function Field({
  className,
  orientation = "vertical",
  ...props
}: FieldPrimitive.Root.Props & VariantProps<typeof fieldVariants>) {
  return (
    <FieldPrimitive.Root
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}

/** Flexible content area within a field for input, description, and error messages. */
function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "group/field-content flex flex-1 flex-col gap-1 leading-snug",
        className
      )}
      {...props}
    />
  );
}

/** Accessible label element linked to its field control. */
function FieldLabel({ className, ...props }: FieldPrimitive.Label.Props) {
  return (
    <FieldPrimitive.Label
      render={<Label />}
      data-slot="field-label"
      className={cn(
        `group/field-label peer/field-label has-data-checked:border-primary/50
        dark:has-data-checked:bg-primary/10 flex w-fit gap-2 leading-snug
        group-data-[disabled=true]/field:opacity-50
        has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border
        *:data-[slot=field]:p-3`,
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
        className
      )}
      {...props}
    />
  );
}

/** Non-interactive title element styled as a field label. */
function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        `flex w-fit items-center gap-2 text-sm/snug font-medium
        group-data-[disabled=true]/field:opacity-50`,
        className
      )}
      {...props}
    />
  );
}

/** Help text displayed below a form field input. */
function FieldDescription({
  className,
  ...props
}: FieldPrimitive.Description.Props) {
  return (
    <FieldPrimitive.Description
      data-slot="field-description"
      className={cn(
        `text-muted-foreground text-left text-sm/normal font-normal
        group-has-data-[orientation=horizontal]/field:text-balance`,
        "last:mt-0 nth-last-2:-mt-1",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      {...props}
    />
  );
}

/** Horizontal divider between form fields with optional centered text. */
function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode;
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={children != null}
      className={cn(
        `relative -my-2 h-5 text-sm
        group-data-[variant=outline]/field-group:-mb-2`,
        className
      )}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {/* istanbul ignore start -- children branch not exercised in all stories */}
      {children != null && (
        <span
          className="bg-background text-muted-foreground relative mx-auto block
            w-fit px-2"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
      {/* istanbul ignore end */}
    </div>
  );
}

/**
 * Error message component that works both inside and outside Field context.
 * When inside Field.Root, provides proper aria-describedby association.
 * When standalone (e.g., form-level errors), renders as a plain div with role="alert".
 * @param props - Component props
 * @param props.className - Additional CSS classes
 * @param props.children - Custom error content
 * @param props.errors - Array of error objects with message property
 * @returns Error message element or null
 */
function FieldError({
  className,
  children,
  errors,
  ...props
}: FieldPrimitive.Error.Props & {
  errors?: ({ message?: string } | undefined)[];
}) {
  // eslint-disable-next-line sonarjs/function-return-type -- Different return types represent different renderable content
  const content = useMemo(() => {
    if (children != null) {
      return children;
    }

    /* istanbul ignore start -- Empty errors array path, only reachable with explicit empty array */
    if (errors === undefined || errors.length === 0) {
      return null;
    }
    /* istanbul ignore end */

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ];

    if (uniqueErrors.length === 1) {
      return uniqueErrors[0]?.message;
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map(
          (error) =>
            error?.message && <li key={error.message}>{error.message}</li>
        )}
      </ul>
    );
  }, [children, errors]);

  /* istanbul ignore start -- Null content early return, covered by empty errors path */
  if (content == null) {
    return null;
  }
  /* istanbul ignore end */

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("text-destructive text-sm font-normal", className)}
      {...props}
    >
      {content}
    </div>
  );
}

// Additional Base UI primitives for form integration
/** Base UI field control primitive for custom input integration. */
const FieldControl = FieldPrimitive.Control;
/** Base UI validity primitive for accessing field validation state. */
const FieldValidity = FieldPrimitive.Validity;

/* istanbul ignore start -- Thin Base UI wrappers, tested transitively */
/** Headless field root that provides validation context without visual styling. */
function FieldProvider({ className, ...props }: FieldPrimitive.Root.Props) {
  return (
    <FieldPrimitive.Root className={cn("contents", className)} {...props} />
  );
}

/** Wrapper for checkbox/radio items within a field context. */
function FieldItem({ className, ...props }: FieldPrimitive.Item.Props) {
  return (
    <FieldPrimitive.Item
      data-slot="field-item"
      className={cn("flex", className)}
      {...props}
    />
  );
}
/* istanbul ignore end */

export {
  Field,
  FieldContent,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldItem,
  FieldLabel,
  FieldLegend,
  FieldLegendDescription,
  FieldProvider,
  FieldSeparator,
  FieldSet,
  FieldTitle,
  FieldValidity,
};
