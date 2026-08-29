import type { ColumnSort } from "@tanstack/react-table";

import type { DataTableConfig } from "./config";
import type { FilterItemSchema } from "./parsers";

/**
 * Table-level meta registered through the `tableMeta` feature slot
 * (v9 replacement for the global `TableMeta` module augmentation).
 */
export interface DataTableTableMeta {
  queryKeys?: QueryKeys;
}

/**
 * Column-level meta registered through the `columnMeta` feature slot
 * (v9 replacement for the global `ColumnMeta` module augmentation).
 */
export interface DataTableColumnMeta {
  label?: string;
  placeholder?: string;
  variant?: FilterVariant;
  options?: Option[];
  range?: [number, number];
  unit?: string;
  unitPlacement?: "prefix" | "suffix";
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface QueryKeys {
  page: string;
  perPage: string;
  sort: string;
  filters: string;
  joinOperator: string;
}

export interface Option {
  label: string;
  value: string;
  count?: number;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export type FilterOperator = DataTableConfig["operators"][number];
export type FilterVariant = DataTableConfig["filterVariants"][number];
/** @public */
export type JoinOperator = DataTableConfig["joinOperators"][number];

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, "id"> {
  id: Extract<keyof TData, string>;
}

export interface ExtendedColumnFilter<TData> extends FilterItemSchema {
  id: Extract<keyof TData, string>;
}
