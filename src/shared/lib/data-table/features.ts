import type {
  CellData,
  Column,
  ColumnDef,
  ReactTable,
  Row,
  RowData,
} from "@tanstack/react-table";

import {
  columnFacetingFeature,
  columnFilteringFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  metaHelper,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from "@tanstack/react-table";

import type { DataTableColumnMeta, DataTableTableMeta } from "./types";

/**
 * TanStack Table v9 feature set registered for every data-table instance.
 *
 * Features are tree-shaken in v9, so only the features listed here are
 * bundled and available on the table instance. The full built-in
 * `filterFns`/`sortFns` registries are registered to keep v8's implicit
 * `"auto"` filter and sort resolution working for every column type.
 */
export const dataTableFeatures = tableFeatures({
  columnFacetingFeature,
  columnFilteringFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
  filterFns,
  sortFns,
  tableMeta: metaHelper<DataTableTableMeta>(),
  columnMeta: metaHelper<DataTableColumnMeta>(),
});

/**
 * The `TFeatures` generic shared by every data-table type.
 * Inferred from the feature set registered above.
 */
export type DataTableFeatures = typeof dataTableFeatures;

/** Table instance returned by `useDataTable` (includes `table.state`). */
export type DataTableInstance<TData extends RowData> = ReactTable<
  DataTableFeatures,
  TData
>;

/** Column definition pre-bound to the data-table feature set. */
export type DataTableColumnDef<
  TData extends RowData,
  TValue extends CellData = CellData,
> = ColumnDef<DataTableFeatures, TData, TValue>;

/** Column instance pre-bound to the data-table feature set. */
export type DataTableColumn<TData extends RowData, TValue = unknown> = Column<
  DataTableFeatures,
  TData,
  TValue
>;

/** @public */
export interface DataTableRowAction<TData extends RowData> {
  row: Row<DataTableFeatures, TData>;
  variant: "update" | "delete";
}
