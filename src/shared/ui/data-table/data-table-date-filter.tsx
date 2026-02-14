import type { Column } from "@tanstack/react-table";

import { useMemo } from "react";

import type { DateRange } from "react-day-picker";
import { CalendarIcon, XCircle } from "lucide-react";

import { formatDate } from "@/shared/lib/data-table";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Separator } from "@/shared/ui/separator";

type DateSelection = Date[] | DateRange;

function getIsDateRange(value: DateSelection): value is DateRange {
  return !Array.isArray(value);
}

function parseAsDate(timestamp: number | string | undefined): Date | undefined {
  if (timestamp == null) return undefined;
  const numericTimestamp =
    typeof timestamp === "string" ? Number(timestamp) : timestamp;
  const date = new Date(numericTimestamp);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function parseColumnFilterValue(
  value: unknown
): (number | string | undefined)[] {
  if (value === null || value === undefined) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) =>
      typeof item === "number" || typeof item === "string" ? item : undefined
    );
  }

  if (typeof value === "string" || typeof value === "number") {
    return [value];
  }

  return [];
}

function formatDateRangeLabel(range: DateRange): string {
  if (range.from == null && range.to == null) return "";
  if (range.from != null && range.to != null) {
    return `${formatDate(range.from)} - ${formatDate(range.to)}`;
  }
  const singleDate = range.from ?? range.to;
  return singleDate == null ? "" : formatDate(singleDate);
}

interface DataTableDateFilterProps<TData> {
  column: Column<TData>;
  title?: string;
  multiple?: boolean;
}

/**
 *
 */
export function DataTableDateFilter<TData>({
  column,
  title,
  multiple,
}: DataTableDateFilterProps<TData>) {
  const columnFilterValue = column.getFilterValue();

  // eslint-disable-next-line sonarjs/function-return-type -- union type DateSelection requires different return shapes
  const selectedDates = useMemo<DateSelection>(() => {
    if (columnFilterValue == null) {
      return multiple ? { from: undefined, to: undefined } : [];
    }

    if (multiple) {
      const timestamps = parseColumnFilterValue(columnFilterValue);
      return {
        from: parseAsDate(timestamps[0]),
        to: parseAsDate(timestamps[1]),
      };
    }

    const timestamps = parseColumnFilterValue(columnFilterValue);
    const date = parseAsDate(timestamps[0]);
    return date == null ? [] : [date];
  }, [columnFilterValue, multiple]);

  const onSelect = (date: Date | DateRange | undefined) => {
    if (date == null) {
      column.setFilterValue(undefined);
      return;
    }

    if (multiple && !("getTime" in date)) {
      const from = date.from?.getTime();
      const to = date.to?.getTime();
      column.setFilterValue(
        from != null || to != null ? [from, to] : undefined
      );
    } else if (!multiple && "getTime" in date) {
      column.setFilterValue(date.getTime());
    }
  };

  const onReset = (event: React.MouseEvent) => {
    event.stopPropagation();
    column.setFilterValue(undefined);
  };

  const hasValue = useMemo(() => {
    if (multiple) {
      if (!getIsDateRange(selectedDates)) return false;
      return selectedDates.from != null || selectedDates.to != null;
    }
    if (!Array.isArray(selectedDates)) return false;
    return selectedDates.length > 0;
  }, [multiple, selectedDates]);

  const label = useMemo(() => {
    if (multiple) {
      if (!getIsDateRange(selectedDates)) return null;

      const hasSelectedDates =
        selectedDates.from != null || selectedDates.to != null;
      const dateText = hasSelectedDates
        ? formatDateRangeLabel(selectedDates)
        : "Select date range";

      return (
        <span className="flex items-center gap-2">
          <span>{title}</span>
          {hasSelectedDates && (
            <>
              <Separator
                orientation="vertical"
                className="mx-0.5 data-[orientation=vertical]:h-4"
              />
              <span>{dateText}</span>
            </>
          )}
        </span>
      );
    }

    if (getIsDateRange(selectedDates)) return null;

    const hasSelectedDate = selectedDates.length > 0;
    const dateText = hasSelectedDate
      ? formatDate(selectedDates[0])
      : "Select date";

    return (
      <span className="flex items-center gap-2">
        <span>{title}</span>
        {hasSelectedDate && (
          <>
            <Separator
              orientation="vertical"
              className="mx-0.5 data-[orientation=vertical]:h-4"
            />
            <span>{dateText}</span>
          </>
        )}
      </span>
    );
  }, [selectedDates, multiple, title]);

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="border-dashed font-normal"
          />
        }
      >
        {hasValue ? (
          <div
            role="button"
            aria-label={`Clear ${title} filter`}
            tabIndex={0}
            onClick={onReset}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                onReset(event as unknown as React.MouseEvent);
              }
            }}
            className="focus-visible:ring-ring rounded-sm opacity-70
              transition-opacity hover:opacity-100 focus-visible:ring-1
              focus-visible:outline-none"
          >
            <XCircle />
          </div>
        ) : (
          <CalendarIcon />
        )}
        {label}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {multiple ? (
          <Calendar
            // eslint-disable-next-line jsx-a11y/no-autofocus -- intentional focus management
            autoFocus
            captionLayout="dropdown"
            mode="range"
            selected={
              getIsDateRange(selectedDates)
                ? selectedDates
                : { from: undefined, to: undefined }
            }
            onSelect={onSelect}
          />
        ) : (
          <Calendar
            captionLayout="dropdown"
            mode="single"
            selected={
              getIsDateRange(selectedDates) ? undefined : selectedDates[0]
            }
            onSelect={onSelect}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
