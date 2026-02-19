import type { Column, Table } from "@tanstack/react-table";

import { useCallback, useMemo } from "react";

import type { ComponentProps } from "react";
import { X } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import { DataTableDateFilter } from "./data-table-date-filter";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableSliderFilter } from "./data-table-slider-filter";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> extends ComponentProps<"div"> {
  table: Table<TData>;
}

/**
 *
 */
export function DataTableToolbar<TData>({
  table,
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const columns = useMemo(
    () => table.getAllColumns().filter((column) => column.getCanFilter()),
    [table]
  );

  const onReset = useCallback(() => {
    table.resetColumnFilters();
  }, [table]);

  return (
    <div
      data-slot="data-table-toolbar"
      role="toolbar"
      aria-orientation="horizontal"
      className={cn(
        "flex w-full items-start justify-between gap-2 p-1",
        className
      )}
      {...props}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {columns.map((column) => (
          <DataTableToolbarFilter key={column.id} column={column} />
        ))}
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="outline"
            size="sm"
            className="border-dashed"
            onClick={onReset}
          >
            <X />
            Reset
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        <DataTableViewOptions table={table} align="end" />
      </div>
    </div>
  );
}

interface DataTableToolbarFilterProps<TData> {
  column: Column<TData>;
}

function DataTableToolbarFilter<TData>({
  column,
}: DataTableToolbarFilterProps<TData>) {
  const columnMeta = column.columnDef.meta;

  const onFilterRender = useCallback(() => {
    /* istanbul ignore next @preserve */
    if (columnMeta?.variant == null) return null;

    /* istanbul ignore next @preserve */
    const placeholder = columnMeta.placeholder ?? columnMeta.label;
    /* istanbul ignore next @preserve */
    const title = columnMeta.label ?? column.id;
    /* istanbul ignore next @preserve */
    const options = columnMeta.options ?? [];

    switch (columnMeta.variant) {
      case "text":
        return (
          <Input
            placeholder={placeholder}
            value={(column.getFilterValue() as string | undefined) ?? ""}
            onChange={(event) => column.setFilterValue(event.target.value)}
            className="h-8 w-40 lg:w-56"
          />
        );

      case "number":
        return (
          <div className="relative">
            <Input
              type="number"
              inputMode="numeric"
              placeholder={placeholder}
              value={(column.getFilterValue() as string | undefined) ?? ""}
              onChange={(event) => column.setFilterValue(event.target.value)}
              className={cn("h-8 w-[120px]", columnMeta.unit && "pr-8")}
            />
            {columnMeta.unit && (
              <span className="bg-accent text-muted-foreground absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 text-sm">
                {columnMeta.unit}
              </span>
            )}
          </div>
        );

      case "range":
        return <DataTableSliderFilter column={column} title={title} />;

      case "date":
      case "dateRange":
        return (
          <DataTableDateFilter
            column={column}
            title={title}
            multiple={columnMeta.variant === "dateRange"}
          />
        );

      case "select":
      case "multiSelect":
        return (
          <DataTableFacetedFilter
            column={column}
            title={title}
            options={options}
            multiple={columnMeta.variant === "multiSelect"}
          />
        );

      /* istanbul ignore next @preserve */
      default:
        return null;
    }
  }, [column, columnMeta]);

  return onFilterRender();
}
