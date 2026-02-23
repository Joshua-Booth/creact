import type { Column } from "@tanstack/react-table";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { DateRange } from "react-day-picker";
import { CalendarIcon, XCircle } from "lucide-react";

import { formatDate } from "@/shared/lib/data-table";
import {
  formatDateRangeLabel,
  getIsDateRange,
  parseAsDate,
  parseColumnFilterValue,
} from "@/shared/lib/data-table/date-filter-utils";
import { Button } from "@/shared/ui/button";
import { ButtonGroup } from "@/shared/ui/button-group";
import { Calendar } from "@/shared/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Separator } from "@/shared/ui/separator";

type DateSelection = Date[] | DateRange;

interface DataTableDateFilterProps<TData> {
  /** Column instance to read and write date filter values. */
  column: Column<TData>;
  /** Display label for the filter trigger button. */
  title?: string;
  /** When true, enables date range selection instead of single date. */
  multiple?: boolean;
}

/** Calendar-based date filter popover supporting single date or date range selection. */
export function DataTableDateFilter<TData>({
  column,
  title,
  multiple,
}: DataTableDateFilterProps<TData>) {
  const { t } = useTranslation("components");
  const columnFilterValue = column.getFilterValue();

  // eslint-disable-next-line sonarjs/function-return-type -- union type DateSelection requires different return shapes
  const selectedDates = useMemo<DateSelection>(() => {
    /* istanbul ignore else @preserve */
    if (columnFilterValue == null) {
      return multiple ? { from: undefined, to: undefined } : [];
    }

    /* istanbul ignore next @preserve */
    if (multiple) {
      const timestamps = parseColumnFilterValue(columnFilterValue);
      return {
        from: parseAsDate(timestamps[0]),
        to: parseAsDate(timestamps[1]),
      };
    }

    /* istanbul ignore next @preserve */
    const timestamps = parseColumnFilterValue(columnFilterValue);
    /* istanbul ignore next @preserve */
    const date = parseAsDate(timestamps[0]);
    /* istanbul ignore next @preserve */
    return date == null ? [] : [date];
  }, [columnFilterValue, multiple]);

  /* istanbul ignore next @preserve */
  const onSelect = (date: Date | DateRange | undefined) => {
    /* istanbul ignore next @preserve */
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

  /* istanbul ignore next @preserve */
  const onReset = () => {
    column.setFilterValue(undefined);
  };

  const hasValue = useMemo(() => {
    if (multiple) {
      /* istanbul ignore next @preserve */
      if (!getIsDateRange(selectedDates)) return false;
      /* istanbul ignore next @preserve */
      return selectedDates.from != null || selectedDates.to != null;
    }
    /* istanbul ignore next @preserve */
    if (!Array.isArray(selectedDates)) return false;
    /* istanbul ignore next @preserve */
    return selectedDates.length > 0;
  }, [multiple, selectedDates]);

  const label = useMemo(() => {
    if (multiple) {
      /* istanbul ignore next @preserve */
      if (!getIsDateRange(selectedDates)) return null;

      /* istanbul ignore next @preserve */
      const hasSelectedDates =
        selectedDates.from != null || selectedDates.to != null;
      /* istanbul ignore next @preserve */
      const dateText = hasSelectedDates
        ? formatDateRangeLabel(selectedDates)
        : t("dataTable.selectDateRange");
      /* istanbul ignore next @preserve */
      const separator = hasSelectedDates ? (
        <>
          <Separator
            orientation="vertical"
            className="mx-0.5 data-[orientation=vertical]:h-4
              data-[orientation=vertical]:self-center"
          />
          <span>{dateText}</span>
        </>
      ) : null;

      return (
        <span className="flex items-center gap-2">
          <span>{title}</span>
          {separator}
        </span>
      );
    }

    /* istanbul ignore next @preserve */
    if (getIsDateRange(selectedDates)) return null;

    /* istanbul ignore next @preserve */
    const hasSelectedDate = selectedDates.length > 0;
    /* istanbul ignore next @preserve */
    const dateText = hasSelectedDate
      ? formatDate(selectedDates[0])
      : t("dataTable.selectDate");
    /* istanbul ignore next @preserve */
    const separator = hasSelectedDate ? (
      <>
        <Separator
          orientation="vertical"
          className="mx-0.5 data-[orientation=vertical]:h-4
            data-[orientation=vertical]:self-center"
        />
        <span>{dateText}</span>
      </>
    ) : null;

    return (
      <span className="flex items-center gap-2">
        <span>{title}</span>
        {separator}
      </span>
    );
  }, [selectedDates, multiple, title, t]);

  /* istanbul ignore next @preserve */
  const trigger = hasValue ? (
    <ButtonGroup>
      <Button
        variant="outline"
        size="sm"
        className="border-dashed px-2"
        aria-label={t("dataTable.clearFilter", { title })}
        onClick={onReset}
      >
        <XCircle />
      </Button>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="border-dashed font-normal"
          />
        }
      >
        {label}
      </PopoverTrigger>
    </ButtonGroup>
  ) : (
    <PopoverTrigger
      render={
        <Button
          variant="outline"
          size="sm"
          className="border-dashed font-normal"
        />
      }
    >
      <CalendarIcon />
      {label}
    </PopoverTrigger>
  );

  /* istanbul ignore next @preserve */
  const rangeSelected = getIsDateRange(selectedDates)
    ? selectedDates
    : { from: undefined, to: undefined };
  /* istanbul ignore next @preserve */
  const singleSelected = getIsDateRange(selectedDates)
    ? undefined
    : selectedDates[0];

  return (
    <Popover>
      {trigger}
      <PopoverContent
        className="w-auto p-0"
        align="start"
        aria-label={t("dataTable.filterBy", { title })}
      >
        {multiple ? (
          <Calendar
            // eslint-disable-next-line jsx-a11y/no-autofocus -- intentional focus management
            autoFocus
            captionLayout="dropdown"
            mode="range"
            selected={rangeSelected}
            onSelect={onSelect}
          />
        ) : (
          <Calendar
            captionLayout="dropdown"
            mode="single"
            selected={singleSelected}
            onSelect={onSelect}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
