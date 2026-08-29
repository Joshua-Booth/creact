import type {
  Cell,
  CellData,
  Column,
  ColumnDef,
  ReactTable,
  RowData,
} from "@tanstack/react-table";

import {
  columnFilteringFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createSortedRowModel,
  filterFns,
  metaHelper,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from "@tanstack/react-table";

import type {
  DataGridColumnMeta,
  DataGridTableMeta,
  RowHeightValue,
} from "./types";

/**
 * TanStack Table v9 feature set registered for every data-grid instance.
 *
 * Features are tree-shaken in v9, so only the features listed here are
 * bundled and available on the table instance. The full built-in
 * `filterFns`/`sortFns` registries are registered to keep v8's implicit
 * `"auto"` filter and sort resolution working for every column type.
 */
export const dataGridFeatures = tableFeatures({
  columnFilteringFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnSizingFeature,
  columnResizingFeature,
  columnVisibilityFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns,
  sortFns,
  tableMeta: metaHelper<DataGridTableMeta>(),
  columnMeta: metaHelper<DataGridColumnMeta>(),
});

/**
 * The `TFeatures` generic shared by every data-grid type.
 * Inferred from the feature set registered above.
 */
export type DataGridFeatures = typeof dataGridFeatures;

/** Table instance returned by `useDataGrid` (includes `table.state`). */
export type DataGridInstance<TData extends RowData> = ReactTable<
  DataGridFeatures,
  TData
>;

/** Column definition pre-bound to the data-grid feature set. */
export type DataGridColumnDef<
  TData extends RowData,
  TValue extends CellData = CellData,
> = ColumnDef<DataGridFeatures, TData, TValue>;

/** Column instance pre-bound to the data-grid feature set. */
export type DataGridColumn<TData extends RowData, TValue = unknown> = Column<
  DataGridFeatures,
  TData,
  TValue
>;

export interface DataGridCellProps<TData extends RowData> {
  cell: Cell<DataGridFeatures, TData>;
  tableMeta: DataGridTableMeta;
  rowIndex: number;
  columnId: string;
  rowHeight: RowHeightValue;
  isEditing: boolean;
  isFocused: boolean;
  isSelected: boolean;
  isSearchMatch: boolean;
  isActiveSearchMatch: boolean;
  readOnly: boolean;
}
