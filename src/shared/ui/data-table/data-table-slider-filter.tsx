import type { Column } from "@tanstack/react-table";

import { useCallback, useId, useMemo } from "react";

import { PlusCircle, XCircle } from "lucide-react";

import {
  formatValue,
  getIsValidRange,
  parseValuesAsNumbers,
} from "@/shared/lib/data-table/slider-filter-utils";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { ButtonGroup } from "@/shared/ui/button-group";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Separator } from "@/shared/ui/separator";
import { Slider } from "@/shared/ui/slider";

type RangeValue = [number, number];

interface Range {
  min: number;
  max: number;
}

interface DataTableSliderFilterProps<TData> {
  column: Column<TData>;
  title?: string;
}

/**
 *
 */
export function DataTableSliderFilter<TData>({
  column,
  title,
}: DataTableSliderFilterProps<TData>) {
  const id = useId();

  const columnFilterValue = parseValuesAsNumbers(column.getFilterValue());

  const defaultRange = column.columnDef.meta?.range;
  const unit = column.columnDef.meta?.unit;

  const { min, max, step } = useMemo<Range & { step: number }>(() => {
    let minValue = 0;
    let maxValue = 100;

    /* istanbul ignore else @preserve */
    if (defaultRange && getIsValidRange(defaultRange)) {
      [minValue, maxValue] = defaultRange;
    } else {
      const values = column.getFacetedMinMaxValues();
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- defensive check for runtime safety
      if (values != null && Array.isArray(values) && values.length === 2) {
        const [facetMinValue, facetMaxValue] = values;
        if (
          typeof facetMinValue === "number" &&
          typeof facetMaxValue === "number"
        ) {
          minValue = facetMinValue;
          maxValue = facetMaxValue;
        }
      }
    }

    const rangeSize = maxValue - minValue;
    let step: number;
    /* istanbul ignore next @preserve */
    if (rangeSize <= 20) {
      step = 1;
    } else if (rangeSize <= 100) {
      step = Math.ceil(rangeSize / 20);
    } else {
      step = Math.ceil(rangeSize / 50);
    }

    return { min: minValue, max: maxValue, step };
  }, [column, defaultRange]);

  const range = useMemo((): RangeValue => {
    return columnFilterValue ?? [min, max];
  }, [columnFilterValue, min, max]);

  const onFromInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const numValue = Number(event.target.value);
      /* istanbul ignore else @preserve */
      if (!Number.isNaN(numValue) && numValue >= min && numValue <= range[1]) {
        column.setFilterValue([numValue, range[1]]);
      }
    },
    [column, min, range]
  );

  /* istanbul ignore next @preserve */
  const onToInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const numValue = Number(event.target.value);
      if (!Number.isNaN(numValue) && numValue <= max && numValue >= range[0]) {
        column.setFilterValue([range[0], numValue]);
      }
    },
    [column, max, range]
  );

  /* istanbul ignore next @preserve */
  const onSliderValueChange = useCallback(
    (value: number | readonly number[]) => {
      if (Array.isArray(value) && value.length === 2) {
        column.setFilterValue(value);
      }
    },
    [column]
  );

  const onReset = useCallback(() => {
    column.setFilterValue(undefined);
  }, [column]);

  /* istanbul ignore next @preserve */
  const unitSuffix = unit ? ` ${unit}` : "";

  return (
    <Popover>
      {columnFilterValue == null ? (
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              size="sm"
              className="border-dashed font-normal"
            />
          }
        >
          <PlusCircle />
          <span>{title}</span>
        </PopoverTrigger>
      ) : (
        <ButtonGroup>
          <Button
            variant="outline"
            size="sm"
            className="border-dashed px-2"
            aria-label={`Clear ${title} filter`}
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
            <span>{title}</span>
            <Separator
              orientation="vertical"
              className="mx-0.5 data-[orientation=vertical]:h-4
                data-[orientation=vertical]:self-center"
            />
            {formatValue(columnFilterValue[0])} -{" "}
            {formatValue(columnFilterValue[1])}
            {unitSuffix}
          </PopoverTrigger>
        </ButtonGroup>
      )}
      <PopoverContent
        align="start"
        className="flex w-auto flex-col gap-4"
        aria-label={`Filter by ${title}`}
      >
        <div className="flex flex-col gap-3">
          <p
            className="leading-none font-medium peer-disabled:cursor-not-allowed
              peer-disabled:opacity-70"
          >
            {title}
          </p>
          <div className="flex items-center gap-4">
            <Label htmlFor={`${id}-from`} className="sr-only">
              From
            </Label>
            <div className="relative">
              <Input
                id={`${id}-from`}
                type="number"
                aria-valuemin={min}
                aria-valuemax={max}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={min.toString()}
                min={min}
                max={max}
                value={range[0].toString()}
                onChange={onFromInputChange}
                className={cn("h-8 w-24", unit && "pr-8")}
              />
              {unit && (
                <span
                  className="bg-accent text-muted-foreground absolute top-0
                    right-0 bottom-0 flex items-center rounded-r-md px-2
                    text-sm"
                >
                  {unit}
                </span>
              )}
            </div>
            <Label htmlFor={`${id}-to`} className="sr-only">
              to
            </Label>
            <div className="relative">
              <Input
                id={`${id}-to`}
                type="number"
                aria-valuemin={min}
                aria-valuemax={max}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={max.toString()}
                min={min}
                max={max}
                value={range[1].toString()}
                onChange={onToInputChange}
                className={cn("h-8 w-24", unit && "pr-8")}
              />
              {unit && (
                <span
                  className="bg-accent text-muted-foreground absolute top-0
                    right-0 bottom-0 flex items-center rounded-r-md px-2
                    text-sm"
                >
                  {unit}
                </span>
              )}
            </div>
          </div>
          <Label htmlFor={`${id}-slider`} className="sr-only">
            {title} slider
          </Label>
          <Slider
            id={`${id}-slider`}
            aria-label={`${title} range`}
            min={min}
            max={max}
            step={step}
            value={range}
            onValueChange={onSliderValueChange}
          />
        </div>
        <Button
          aria-label={`Clear ${title} filter`}
          variant="outline"
          size="sm"
          onClick={onReset}
        >
          Clear
        </Button>
      </PopoverContent>
    </Popover>
  );
}
