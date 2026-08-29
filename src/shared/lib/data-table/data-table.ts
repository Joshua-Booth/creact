import type { RowData } from "@tanstack/react-table";

import type { DataTableColumn } from "./features";
import type {
  ExtendedColumnFilter,
  FilterOperator,
  FilterVariant,
} from "./types";
import { dataTableConfig } from "./config";

/**
 * Compute CSS properties for pinned columns in a data table.
 * @param root0 - The pinning style options
 * @param root0.column - The column to compute pinning styles for
 * @param root0.withBorder - Whether to include border shadow styles
 * @returns CSS properties for the pinned column
 */
export function getCommonPinningStyles<TData extends RowData>({
  column,
  withBorder = false,
}: {
  column: DataTableColumn<TData>;
  withBorder?: boolean;
}): React.CSSProperties {
  const isPinned = column.getIsPinned();
  const isLastStartPinnedColumn =
    isPinned === "start" && column.getIsLastColumn("start");
  const isFirstEndPinnedColumn =
    isPinned === "end" && column.getIsFirstColumn("end");

  let boxShadow: string | undefined;
  if (withBorder) {
    if (isLastStartPinnedColumn) {
      boxShadow = "-4px 0 4px -4px var(--border) inset";
    } else if (isFirstEndPinnedColumn) {
      boxShadow = "4px 0 4px -4px var(--border) inset";
    }
  }

  const hasExplicitSize = column.columnDef.size != null;

  return {
    boxShadow,
    left: isPinned === "start" ? `${column.getStart("start")}px` : undefined,
    right: isPinned === "end" ? `${column.getAfter("end")}px` : undefined,
    opacity: isPinned === false ? 1 : 0.97,
    position: isPinned === false ? "relative" : "sticky",
    background: "var(--background)",
    width: column.getSize(),
    maxWidth: hasExplicitSize ? column.getSize() : undefined,
    zIndex: isPinned === false ? undefined : 1,
  };
}

/**
 * Retrieve the available filter operators for a given filter variant.
 * @param filterVariant - The variant of the filter column
 * @returns An array of operator label/value pairs
 */
export function getFilterOperators(filterVariant: FilterVariant) {
  const operatorMap: Record<
    FilterVariant,
    { label: string; value: FilterOperator }[]
  > = {
    text: dataTableConfig.textOperators,
    number: dataTableConfig.numericOperators,
    range: dataTableConfig.numericOperators,
    date: dataTableConfig.dateOperators,
    dateRange: dataTableConfig.dateOperators,
    boolean: dataTableConfig.booleanOperators,
    select: dataTableConfig.selectOperators,
    multiSelect: dataTableConfig.multiSelectOperators,
  };

  return operatorMap[filterVariant];
}

/**
 * Retrieve the default filter operator for a given filter variant.
 * @param filterVariant - The variant of the filter column
 * @returns The default operator value string
 */
export function getDefaultFilterOperator(filterVariant: FilterVariant) {
  const operators = getFilterOperators(filterVariant);
  /* istanbul ignore next @preserve */
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- operators arrays are always non-empty
  return operators[0]!.value;
}

/**
 * Filter out invalid or empty filter entries.
 * @param filters - The array of column filters to validate
 * @returns Only the filters that contain valid, non-empty values
 */
export function getValidFilters<TData>(
  filters: ExtendedColumnFilter<TData>[]
): ExtendedColumnFilter<TData>[] {
  return filters.filter(
    (filter) =>
      filter.operator === "isEmpty" ||
      filter.operator === "isNotEmpty" ||
      (Array.isArray(filter.value)
        ? filter.value.length > 0
        : filter.value !== "")
  );
}
