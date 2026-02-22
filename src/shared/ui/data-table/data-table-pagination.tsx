import type { Table } from "@tanstack/react-table";

import { useTranslation } from "react-i18next";

import type { ComponentProps } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];

interface DataTablePaginationProps<TData> extends ComponentProps<"div"> {
  /** TanStack Table instance for reading and updating pagination state. */
  table: Table<TData>;
  /** Available page size choices shown in the rows-per-page dropdown. */
  pageSizeOptions?: number[];
}

/** Pagination controls with page navigation, rows-per-page selector, and selection count. */
export function DataTablePagination<TData>({
  table,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  className,
  ...props
}: DataTablePaginationProps<TData>) {
  const { t } = useTranslation("components");

  return (
    <div
      data-slot="data-table-pagination"
      className={cn(
        `flex w-full flex-col-reverse items-center justify-between gap-4
        overflow-auto p-1 sm:flex-row sm:gap-8`,
        className
      )}
      {...props}
    >
      <div className="text-muted-foreground flex-1 text-sm whitespace-nowrap">
        {t("dataTable.rowsSelected", {
          selected: table.getFilteredSelectedRowModel().rows.length,
          total: table.getFilteredRowModel().rows.length,
        })}
      </div>
      <div
        className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6
          lg:gap-8"
      >
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium whitespace-nowrap">
            {t("dataTable.rowsPerPage")}
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger
              aria-label="Rows per page"
              className="h-8 w-18 data-size:h-8"
            >
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center text-sm font-medium">
          {t("dataTable.page", {
            current: table.getState().pagination.pageIndex + 1,
            total: table.getPageCount(),
          })}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            aria-label="Go to first page"
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft />
          </Button>
          <Button
            aria-label="Go to previous page"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>
          <Button
            aria-label="Go to next page"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>
          <Button
            aria-label="Go to last page"
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
