import type { TableMeta } from "@tanstack/react-table";

import { memo, useCallback, useRef } from "react";

import type { PasteDialogState } from "@/shared/lib/data-grid";
import { useAsRef } from "@/shared/lib/data-grid";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

interface DataGridPasteDialogProps<TData> {
  tableMeta: TableMeta<TData>;
  pasteDialog: PasteDialogState;
}

/** Dialog for handling paste overflow when clipboard data exceeds available rows. */
export function DataGridPasteDialog<TData>({
  tableMeta,
  pasteDialog,
}: DataGridPasteDialogProps<TData>) {
  const onPasteDialogOpenChange = tableMeta.onPasteDialogOpenChange;
  const onCellsPaste = tableMeta.onCellsPaste;

  if (!pasteDialog.open) return null;

  /* v8 ignore start -- browser-only callback tested via Storybook */
  return (
    <PasteDialogInner
      pasteDialog={pasteDialog}
      onPasteDialogOpenChange={onPasteDialogOpenChange}
      onCellsPaste={onCellsPaste}
    />
  );
  /* v8 ignore stop */
}

interface PasteDialogInnerProps
  extends
    Pick<TableMeta<unknown>, "onPasteDialogOpenChange" | "onCellsPaste">,
    Required<Pick<TableMeta<unknown>, "pasteDialog">> {}

/* v8 ignore start -- memo comparator is a performance optimization */
const PasteDialogInner = memo(PasteDialogInnerImpl, (prev, next) => {
  if (prev.pasteDialog.open !== next.pasteDialog.open) return false;
  if (!next.pasteDialog.open) return true;
  if (prev.pasteDialog.rowsNeeded !== next.pasteDialog.rowsNeeded) return false;

  return true;
});
/* v8 ignore stop */

/* v8 ignore start -- browser-only callback tested via Storybook */
function PasteDialogInnerImpl({
  pasteDialog,
  onPasteDialogOpenChange,
  onCellsPaste,
}: PasteDialogInnerProps) {
  const propsRef = useAsRef({
    onPasteDialogOpenChange,
    onCellsPaste,
  });

  const expandRadioRef = useRef<HTMLInputElement | null>(null);

  const onOpenChange = useCallback(
    (open: boolean) => {
      propsRef.current.onPasteDialogOpenChange?.(open);
    },
    [propsRef]
  );

  const onCancel = useCallback(() => {
    propsRef.current.onPasteDialogOpenChange?.(false);
  }, [propsRef]);

  const onContinue = useCallback(() => {
    propsRef.current.onCellsPaste?.(expandRadioRef.current?.checked ?? false);
  }, [propsRef]);

  return (
    <Dialog open={pasteDialog.open} onOpenChange={onOpenChange}>
      <DialogContent data-grid-popover="" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Do you want to add more rows?</DialogTitle>
          <DialogDescription>
            We need <strong>{pasteDialog.rowsNeeded}</strong> additional row
            {pasteDialog.rowsNeeded === 1 ? "" : "s"} to paste everything from
            your clipboard.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-1">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- radio input nested inside label */}
          <label className="flex cursor-pointer items-start gap-3">
            <RadioItem
              ref={expandRadioRef}
              name="expand-option"
              value="expand"
              defaultChecked
            />
            <div className="flex flex-col gap-1">
              <span className="text-sm leading-none font-medium">
                Create new rows
              </span>
              <span className="text-muted-foreground text-sm">
                Add {pasteDialog.rowsNeeded} new row
                {pasteDialog.rowsNeeded === 1 ? "" : "s"} to the table and paste
                all data
              </span>
            </div>
          </label>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- radio input nested inside label */}
          <label className="flex cursor-pointer items-start gap-3">
            <RadioItem name="expand-option" value="no-expand" />
            <div className="flex flex-col gap-1">
              <span className="text-sm leading-none font-medium">
                Keep current rows
              </span>
              <span className="text-muted-foreground text-sm">
                Paste only what fits in the existing rows
              </span>
            </div>
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onContinue}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
/* v8 ignore stop */

function RadioItem({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type="radio"
      className={cn(
        `border-input bg-background relative size-4 shrink-0 appearance-none
        rounded-full border shadow-xs transition-[color,box-shadow]
        outline-none`,
        `text-primary focus-visible:border-ring focus-visible:ring-ring/50
        focus-visible:ring-[3px]`,
        "disabled:cursor-not-allowed disabled:opacity-50",
        `checked:before:bg-primary checked:before:absolute
        checked:before:start-1/2 checked:before:top-1/2 checked:before:size-2
        checked:before:-translate-1/2 checked:before:rounded-full
        checked:before:content-['']`,
        "dark:bg-input/30",
        className
      )}
      {...props}
    />
  );
}
