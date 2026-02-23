import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { Plus } from "lucide-react";

import type { Direction, useDataGrid } from "@/shared/lib/data-grid";
import {
  flexRender,
  getColumnBorderVisibility,
  getColumnPinningStyle,
  useAsRef,
} from "@/shared/lib/data-grid";
import { cn } from "@/shared/lib/utils";

import { DataGridColumnHeader } from "./data-grid-column-header";
import { DataGridContextMenu } from "./data-grid-context-menu";
import { DataGridPasteDialog } from "./data-grid-paste-dialog";
import { DataGridRow } from "./data-grid-row";
import { DataGridSearch } from "./data-grid-search";

const EMPTY_CELL_SELECTION_SET = new Set<string>();

/* istanbul ignore start @preserve -- browser-only context menu prevention */
function onDataGridContextMenu(event: React.MouseEvent<HTMLDivElement>) {
  event.preventDefault();
}
/* istanbul ignore end @preserve */

interface DataGridProps<TData>
  extends
    Omit<ReturnType<typeof useDataGrid<TData>>, "dir">,
    Omit<React.ComponentProps<"div">, "contextMenu"> {
  /** Text direction for bidirectional layout support. */
  dir?: Direction;
  /** Maximum pixel height of the scrollable grid area. */
  height?: number;
  /** When true, columns stretch to fill available horizontal space. */
  stretchColumns?: boolean;
}

/** Virtualized editable data grid with keyboard navigation, cell selection, search, and context menu. Powered by TanStack Table and TanStack Virtual. */
export function DataGrid<TData>({
  dataGridRef,
  headerRef,
  rowMapRef,
  footerRef,
  dir = "ltr",
  table,
  tableMeta,
  virtualTotalSize,
  virtualItems,
  measureElement,
  columns,
  columnSizeVars,
  searchState,
  searchMatchesByRow,
  activeSearchMatch,
  cellSelectionMap,
  focusedCell,
  editingCell,
  rowHeight,
  contextMenu,
  pasteDialog,
  onRowAdd: onRowAddProp,
  height = 600,
  stretchColumns = false,
  adjustLayout,
  className,
  ...props
}: DataGridProps<TData>) {
  const { t } = useTranslation("components");
  const rows = table.getRowModel().rows;
  /* istanbul ignore next */
  const readOnly = tableMeta.readOnly ?? false;
  const columnVisibility = table.getState().columnVisibility;
  const columnPinning = table.getState().columnPinning;

  const onRowAddRef = useAsRef(onRowAddProp);

  const onRowAdd = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      void onRowAddRef.current?.(event);
    },
    [onRowAddRef]
  );

  /* istanbul ignore start @preserve -- browser-only callback tested via Storybook */
  const onFooterCellKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!onRowAddRef.current) return;

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        void onRowAddRef.current();
      }
    },
    [onRowAddRef]
  );
  /* istanbul ignore end @preserve */

  return (
    <div
      data-slot="grid-wrapper"
      dir={dir}
      {...props}
      className={cn("relative flex w-full flex-col", className)}
    >
      {searchState && <DataGridSearch {...searchState} />}
      <DataGridContextMenu
        tableMeta={tableMeta}
        columns={columns}
        contextMenu={contextMenu}
      />
      <DataGridPasteDialog tableMeta={tableMeta} pasteDialog={pasteDialog} />
      <div
        role="grid"
        aria-label={t("dataGrid.label")}
        aria-rowcount={rows.length + (onRowAddProp ? 1 : 0)}
        aria-colcount={columns.length}
        data-slot="grid"
        tabIndex={0}
        ref={dataGridRef}
        className="relative grid overflow-auto rounded-md border select-none
          focus:outline-none"
        style={{
          ...columnSizeVars,
          maxHeight: `${height}px`,
        }}
        onContextMenu={onDataGridContextMenu}
      >
        <div
          role="rowgroup"
          data-slot="grid-header"
          ref={headerRef}
          className="bg-background sticky top-0 z-10 grid border-b"
        >
          {table.getHeaderGroups().map((headerGroup, rowIndex) => (
            <div
              key={headerGroup.id}
              role="row"
              aria-rowindex={rowIndex + 1}
              data-slot="grid-header-row"
              tabIndex={-1}
              className="flex w-full"
            >
              {headerGroup.headers.map((header, colIndex) => {
                const sorting = table.getState().sorting;
                /* istanbul ignore start @preserve -- browser-only callback tested via Storybook */
                const currentSort = sorting.find(
                  (sort) => sort.id === header.column.id
                );
                /* istanbul ignore end @preserve */
                const isSortable = header.column.getCanSort();

                const nextHeader = headerGroup.headers[colIndex + 1];
                const isLastColumn =
                  colIndex === headerGroup.headers.length - 1;

                const { showEndBorder, showStartBorder } =
                  getColumnBorderVisibility({
                    column: header.column,
                    nextColumn: nextHeader?.column,
                    isLastColumn,
                  });

                let ariaSortValue:
                  | "ascending"
                  | "descending"
                  | "none"
                  | undefined;
                /* istanbul ignore start @preserve -- browser-only callback tested via Storybook */
                if (currentSort?.desc === false) {
                  ariaSortValue = "ascending";
                } else if (currentSort?.desc === true) {
                  ariaSortValue = "descending";
                } else {
                  ariaSortValue = isSortable ? "none" : undefined;
                }
                /* istanbul ignore end @preserve */

                /* istanbul ignore start @preserve -- browser-only header rendering */
                let headerContent: React.ReactNode = null;
                if (!header.isPlaceholder) {
                  headerContent =
                    typeof header.column.columnDef.header === "function" ? (
                      <div className="size-full px-3 py-1.5">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    ) : (
                      <DataGridColumnHeader header={header} table={table} />
                    );
                }

                return (
                  <div
                    key={header.id}
                    role="columnheader"
                    aria-colindex={colIndex + 1}
                    aria-sort={ariaSortValue}
                    data-slot="grid-header-cell"
                    tabIndex={-1}
                    className={cn("relative", {
                      grow: stretchColumns && header.column.id !== "select",
                      "border-e":
                        showEndBorder && header.column.id !== "select",
                      "border-s":
                        showStartBorder && header.column.id !== "select",
                    })}
                    style={{
                      ...getColumnPinningStyle({ column: header.column, dir }),
                      width: `calc(var(--header-${header.id}-size) * 1px)`,
                    }}
                  >
                    {headerContent}
                  </div>
                );
                /* istanbul ignore end @preserve */
              })}
            </div>
          ))}
        </div>
        <div
          role="rowgroup"
          data-slot="grid-body"
          className="relative grid"
          style={{
            height: `${virtualTotalSize}px`,
            /* istanbul ignore next */
            contain: adjustLayout ? "layout paint" : "strict",
          }}
        >
          {virtualItems.map((virtualItem) => {
            const row = rows[virtualItem.index];
            /* istanbul ignore start @preserve -- defensive guard */
            if (!row) return null;
            /* istanbul ignore end @preserve */

            const cellSelectionKeys =
              cellSelectionMap?.get(virtualItem.index) ??
              EMPTY_CELL_SELECTION_SET;

            const searchMatchColumns =
              searchMatchesByRow?.get(virtualItem.index) ?? null;
            const isActiveSearchRow =
              activeSearchMatch?.rowIndex === virtualItem.index;

            return (
              <DataGridRow
                key={row.id}
                row={row}
                tableMeta={tableMeta}
                rowMapRef={rowMapRef}
                virtualItem={virtualItem}
                measureElement={measureElement}
                rowHeight={rowHeight}
                columnVisibility={columnVisibility}
                columnPinning={columnPinning}
                focusedCell={focusedCell}
                editingCell={editingCell}
                cellSelectionKeys={cellSelectionKeys}
                searchMatchColumns={searchMatchColumns}
                activeSearchMatch={isActiveSearchRow ? activeSearchMatch : null}
                dir={dir}
                adjustLayout={adjustLayout}
                stretchColumns={stretchColumns}
                readOnly={readOnly}
              />
            );
          })}
        </div>
        {!readOnly && onRowAddProp != null && (
          <div
            role="rowgroup"
            data-slot="grid-footer"
            ref={footerRef}
            className="bg-background sticky bottom-0 z-10 grid border-t"
          >
            <div
              role="row"
              aria-rowindex={rows.length + 2}
              data-slot="grid-add-row"
              tabIndex={-1}
              className="flex w-full"
            >
              <div
                role="gridcell"
                tabIndex={0}
                className="bg-muted/30 hover:bg-muted/50 focus:bg-muted/50
                  relative flex h-9 grow items-center transition-colors
                  focus:outline-none"
                style={{
                  width: table.getTotalSize(),
                  minWidth: table.getTotalSize(),
                }}
                onClick={onRowAdd}
                onKeyDown={onFooterCellKeyDown}
              >
                <div
                  className="text-muted-foreground sticky inset-s-0 flex
                    items-center gap-2 px-3"
                >
                  <Plus className="size-3.5" />
                  <span className="text-sm">{t("dataGrid.addRow")}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
