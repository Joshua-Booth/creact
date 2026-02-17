import type {
  ColumnSort,
  Header,
  SortDirection,
  SortingState,
  Table,
} from "@tanstack/react-table";

import { memo, useCallback } from "react";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  EyeOffIcon,
  PinIcon,
  PinOffIcon,
  XIcon,
} from "lucide-react";

import { getColumnVariant } from "@/shared/lib/data-grid";
import { cn } from "@/shared/lib/utils";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

interface DataGridColumnHeaderProps<TData, TValue> extends React.ComponentProps<
  typeof DropdownMenuTrigger
> {
  header: Header<TData, TValue>;
  table: Table<TData>;
}

/** Column header with sort, pin, hide dropdown and column resizer. */
export function DataGridColumnHeader<TData, TValue>({
  header,
  table,
  className,
  ...props
}: DataGridColumnHeaderProps<TData, TValue>) {
  const column = header.column;
  const label =
    column.columnDef.meta?.label ??
    (typeof column.columnDef.header === "string"
      ? column.columnDef.header
      : column.id);

  const isAnyColumnResizing =
    table.getState().columnSizingInfo.isResizingColumn !== false;

  const cellVariant = column.columnDef.meta?.cell;
  const columnVariant = getColumnVariant(cellVariant?.variant);

  const pinnedPosition = column.getIsPinned();
  const isPinnedLeft = pinnedPosition === "left";
  const isPinnedRight = pinnedPosition === "right";

  /* istanbul ignore start @preserve -- browser-only callback tested via Storybook */
  const onSortingChange = useCallback(
    (direction: SortDirection) => {
      table.setSorting((prev: SortingState) => {
        const existingSortIndex = prev.findIndex(
          (sort) => sort.id === column.id
        );
        const newSort: ColumnSort = {
          id: column.id,
          desc: direction === "desc",
        };

        if (existingSortIndex >= 0) {
          const updated = [...prev];
          updated[existingSortIndex] = newSort;
          return updated;
        }
        return [...prev, newSort];
      });
    },
    [column.id, table]
  );

  const onSortRemove = useCallback(() => {
    table.setSorting((prev: SortingState) =>
      prev.filter((sort) => sort.id !== column.id)
    );
  }, [column.id, table]);

  const onLeftPin = useCallback(() => {
    column.pin("left");
  }, [column]);

  const onRightPin = useCallback(() => {
    column.pin("right");
  }, [column]);

  const onUnpin = useCallback(() => {
    column.pin(false);
  }, [column]);

  const onTriggerPointerDown = useCallback(
    (event: React.PointerEvent) => {
      if (event.defaultPrevented) return;

      if (event.button !== 0) {
        return;
      }
      table.options.meta?.onColumnClick?.(column.id);
    },
    [table.options.meta, column.id]
  );
  /* istanbul ignore end @preserve */

  /* istanbul ignore start @preserve -- browser-only JSX tested via Storybook */
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          className={cn(
            `hover:bg-accent/40 data-popup-open:bg-accent/40 flex size-full
            items-center justify-between gap-2 p-2 text-sm [&_svg]:size-4`,
            isAnyColumnResizing && "pointer-events-none",
            className
          )}
          onPointerDown={onTriggerPointerDown}
          {...props}
        >
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            {columnVariant && (
              <TooltipProvider delay={100}>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <columnVariant.icon
                        className="text-muted-foreground size-3.5 shrink-0"
                      />
                    }
                  />
                  <TooltipContent side="top">
                    <p>{columnVariant.label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <span className="truncate">{label}</span>
          </div>
          <ChevronDownIcon className="text-muted-foreground shrink-0" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={0} className="w-60">
          {column.getCanSort() && (
            <>
              <DropdownMenuCheckboxItem
                className="[&_svg]:text-muted-foreground relative ltr:pr-8
                  ltr:pl-2 rtl:pr-2 rtl:pl-8 [&>span:first-child]:ltr:right-2
                  [&>span:first-child]:ltr:left-auto
                  [&>span:first-child]:rtl:right-auto
                  [&>span:first-child]:rtl:left-2"
                checked={column.getIsSorted() === "asc"}
                onClick={
                  /* istanbul ignore next -- browser-only callback tested via Storybook */ () =>
                    onSortingChange("asc")
                }
              >
                <ChevronUpIcon />
                Sort asc
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                className="[&_svg]:text-muted-foreground relative ltr:pr-8
                  ltr:pl-2 rtl:pr-2 rtl:pl-8 [&>span:first-child]:ltr:right-2
                  [&>span:first-child]:ltr:left-auto
                  [&>span:first-child]:rtl:right-auto
                  [&>span:first-child]:rtl:left-2"
                checked={column.getIsSorted() === "desc"}
                onClick={
                  /* istanbul ignore next -- browser-only callback tested via Storybook */ () =>
                    onSortingChange("desc")
                }
              >
                <ChevronDownIcon />
                Sort desc
              </DropdownMenuCheckboxItem>
              {column.getIsSorted() !== false && (
                <DropdownMenuItem onClick={onSortRemove}>
                  <XIcon />
                  Remove sort
                </DropdownMenuItem>
              )}
            </>
          )}
          {column.getCanPin() && (
            <>
              {column.getCanSort() && <DropdownMenuSeparator />}

              {isPinnedLeft ? (
                <DropdownMenuItem
                  className="[&_svg]:text-muted-foreground"
                  onClick={onUnpin}
                >
                  <PinOffIcon />
                  Unpin from left
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="[&_svg]:text-muted-foreground"
                  onClick={onLeftPin}
                >
                  <PinIcon />
                  Pin to left
                </DropdownMenuItem>
              )}
              {isPinnedRight ? (
                <DropdownMenuItem
                  className="[&_svg]:text-muted-foreground"
                  onClick={onUnpin}
                >
                  <PinOffIcon />
                  Unpin from right
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="[&_svg]:text-muted-foreground"
                  onClick={onRightPin}
                >
                  <PinIcon />
                  Pin to right
                </DropdownMenuItem>
              )}
            </>
          )}
          {column.getCanHide() && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="[&_svg]:text-muted-foreground"
                onClick={
                  /* istanbul ignore next -- browser-only callback tested via Storybook */ () =>
                    column.toggleVisibility(false)
                }
              >
                <EyeOffIcon />
                Hide column
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {header.column.getCanResize() && (
        <DataGridColumnResizer header={header} table={table} label={label} />
      )}
    </>
  );
  /* istanbul ignore end @preserve */
}

/* istanbul ignore start @preserve -- memo comparator is a performance optimization */
const DataGridColumnResizer = memo(DataGridColumnResizerImpl, (prev, next) => {
  const prevColumn = prev.header.column;
  const nextColumn = next.header.column;

  if (
    prevColumn.getIsResizing() !== nextColumn.getIsResizing() ||
    prevColumn.getSize() !== nextColumn.getSize()
  ) {
    return false;
  }

  if (prev.label !== next.label) return false;

  return true;
}) as typeof DataGridColumnResizerImpl;
/* istanbul ignore end @preserve */

interface DataGridColumnResizerProps<
  TData,
  TValue,
> extends DataGridColumnHeaderProps<TData, TValue> {
  label: string;
}

/* istanbul ignore start @preserve -- browser-only resizer tested via Storybook */
function DataGridColumnResizerImpl<TData, TValue>({
  header,
  table,
  label,
}: DataGridColumnResizerProps<TData, TValue>) {
  const defaultColumnDef = table._getDefaultColumnDef();

  /* istanbul ignore start @preserve -- browser-only callback tested via Storybook */
  const onDoubleClick = useCallback(() => {
    header.column.resetSize();
  }, [header.column]);
  /* istanbul ignore end @preserve */

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- interactive column resizer
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={`Resize ${label} column`}
      aria-valuenow={header.column.getSize()}
      aria-valuemin={defaultColumnDef.minSize}
      aria-valuemax={defaultColumnDef.maxSize}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- focusable for keyboard navigation
      tabIndex={0}
      className={cn(
        `bg-border hover:bg-primary focus:bg-primary absolute -end-px top-0 z-50
        h-full w-0.5 cursor-ew-resize touch-none transition-opacity select-none
        after:absolute after:inset-y-0 after:start-1/2 after:h-full
        after:w-[18px] after:-translate-x-1/2 after:content-['']
        focus:outline-none`,
        header.column.getIsResizing()
          ? "bg-primary"
          : "opacity-0 hover:opacity-100"
      )}
      onDoubleClick={onDoubleClick}
      onMouseDown={header.getResizeHandler()}
      onTouchStart={header.getResizeHandler()}
    />
  );
}
/* istanbul ignore end @preserve */
