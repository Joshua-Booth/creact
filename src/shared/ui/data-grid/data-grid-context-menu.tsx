import type { ColumnDef, TableMeta } from "@tanstack/react-table";

import { memo, useCallback, useMemo } from "react";

import { CopyIcon, EraserIcon, ScissorsIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import type { CellUpdate, ContextMenuState } from "@/shared/lib/data-grid";
import { parseCellKey, useAsRef } from "@/shared/lib/data-grid";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

interface DataGridContextMenuProps<TData> {
  /** Table metadata providing callbacks for selection, data updates, and row deletion. */
  tableMeta: TableMeta<TData>;
  /** Column definitions used to determine empty values when clearing cells. */
  columns: ColumnDef<TData>[];
  /** Open/position state controlling the context menu visibility. */
  contextMenu: ContextMenuState;
}

/** Right-click context menu with copy, cut, clear, and delete row actions. */
export function DataGridContextMenu<TData>({
  tableMeta,
  columns,
  contextMenu,
}: DataGridContextMenuProps<TData>) {
  const onContextMenuOpenChange = tableMeta.onContextMenuOpenChange;
  const selectionState = tableMeta.selectionState;
  const dataGridRef = tableMeta.dataGridRef;
  const onDataUpdate = tableMeta.onDataUpdate;
  const onRowsDelete = tableMeta.onRowsDelete;
  const onCellsCopy = tableMeta.onCellsCopy;
  const onCellsCut = tableMeta.onCellsCut;

  if (!contextMenu.open) return null;

  return (
    <ContextMenuInner
      tableMeta={tableMeta}
      columns={columns}
      dataGridRef={dataGridRef}
      contextMenu={contextMenu}
      onContextMenuOpenChange={onContextMenuOpenChange}
      selectionState={selectionState}
      onDataUpdate={onDataUpdate}
      onRowsDelete={onRowsDelete}
      onCellsCopy={onCellsCopy}
      onCellsCut={onCellsCut}
    />
  );
}

interface ContextMenuInnerProps<TData>
  extends
    Pick<
      TableMeta<TData>,
      | "dataGridRef"
      | "onContextMenuOpenChange"
      | "selectionState"
      | "onDataUpdate"
      | "onRowsDelete"
      | "onCellsCopy"
      | "onCellsCut"
      | "readOnly"
    >,
    Required<Pick<TableMeta<TData>, "contextMenu">> {
  tableMeta: TableMeta<TData>;
  columns: ColumnDef<TData>[];
}

/* istanbul ignore start @preserve -- memo comparator is a performance optimization */
const ContextMenuInner = memo(ContextMenuInnerImpl, (prev, next) => {
  if (prev.contextMenu.open !== next.contextMenu.open) return false;
  if (!next.contextMenu.open) return true;
  if (prev.contextMenu.x !== next.contextMenu.x) return false;
  if (prev.contextMenu.y !== next.contextMenu.y) return false;

  const prevSize = prev.selectionState?.selectedCells.size ?? 0;
  const nextSize = next.selectionState?.selectedCells.size ?? 0;
  if (prevSize !== nextSize) return false;

  return true;
}) as typeof ContextMenuInnerImpl;
/* istanbul ignore end @preserve */

/* istanbul ignore start @preserve -- browser-only context menu tested via Storybook */
function ContextMenuInnerImpl<TData>({
  tableMeta,
  columns,
  dataGridRef,
  contextMenu,
  onContextMenuOpenChange,
  selectionState,
  onDataUpdate,
  onRowsDelete,
  onCellsCopy,
  onCellsCut,
}: ContextMenuInnerProps<TData>) {
  const propsRef = useAsRef({
    dataGridRef,
    selectionState,
    onDataUpdate,
    onRowsDelete,
    onCellsCopy,
    onCellsCut,
    columns,
  });

  const triggerStyle = useMemo<React.CSSProperties>(
    () => ({
      position: "fixed",
      left: `${contextMenu.x}px`,
      top: `${contextMenu.y}px`,
      width: "1px",
      height: "1px",
      padding: 0,
      margin: 0,
      border: "none",
      background: "transparent",
      pointerEvents: "none",
      opacity: 0,
    }),
    [contextMenu.x, contextMenu.y]
  );

  /* istanbul ignore start @preserve -- browser-only callback tested via Storybook */
  const finalFocus = useCallback(() => {
    propsRef.current.dataGridRef?.current?.focus();
  }, [propsRef]);

  const onCopy = useCallback(() => {
    propsRef.current.onCellsCopy?.();
  }, [propsRef]);

  const onCut = useCallback(() => {
    propsRef.current.onCellsCut?.();
  }, [propsRef]);

  const onClear = useCallback(() => {
    const { selectionState, columns, onDataUpdate } = propsRef.current;

    if (
      !selectionState?.selectedCells ||
      selectionState.selectedCells.size === 0
    )
      return;

    const updates: CellUpdate[] = [];

    for (const cellKey of selectionState.selectedCells) {
      const { rowIndex, columnId } = parseCellKey(cellKey);

      const column = columns.find((col) => {
        if (col.id) return col.id === columnId;
        if ("accessorKey" in col) return col.accessorKey === columnId;
        return false;
      });
      const cellVariant = column?.meta?.cell?.variant;

      let emptyValue: unknown = "";
      switch (cellVariant) {
        case "multi-select":
        case "file": {
          emptyValue = [];

          break;
        }
        case "number":
        case "date": {
          emptyValue = null;

          break;
        }
        case "checkbox": {
          emptyValue = false;

          break;
        }
        // No default
      }

      updates.push({ rowIndex, columnId, value: emptyValue });
    }

    onDataUpdate?.(updates);

    toast.success(
      `${updates.length} cell${updates.length === 1 ? "" : "s"} cleared`
    );
  }, [propsRef]);

  const onDelete = useCallback(() => {
    void (async () => {
      const { selectionState, onRowsDelete } = propsRef.current;

      if (
        !selectionState?.selectedCells ||
        selectionState.selectedCells.size === 0
      )
        return;

      const rowIndices = new Set<number>();
      for (const cellKey of selectionState.selectedCells) {
        const { rowIndex } = parseCellKey(cellKey);
        rowIndices.add(rowIndex);
      }

      const rowIndicesArray = [...rowIndices].sort((a, b) => a - b);
      const rowCount = rowIndicesArray.length;

      await onRowsDelete?.(rowIndicesArray);

      toast.success(`${rowCount} row${rowCount === 1 ? "" : "s"} deleted`);
    })();
  }, [propsRef]);
  /* istanbul ignore end @preserve */

  return (
    <DropdownMenu
      open={contextMenu.open}
      onOpenChange={onContextMenuOpenChange}
    >
      <DropdownMenuTrigger style={triggerStyle} />
      <DropdownMenuContent
        data-grid-popover=""
        align="start"
        className="w-48"
        finalFocus={finalFocus}
      >
        <DropdownMenuItem onSelect={onCopy}>
          <CopyIcon />
          Copy
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onCut} disabled={tableMeta.readOnly}>
          <ScissorsIcon />
          Cut
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onClear} disabled={tableMeta.readOnly}>
          <EraserIcon />
          Clear
        </DropdownMenuItem>
        {onRowsDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={onDelete}>
              <Trash2Icon />
              Delete rows
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
/* istanbul ignore end @preserve */
