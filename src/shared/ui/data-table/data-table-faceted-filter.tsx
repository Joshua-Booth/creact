import type { Column } from "@tanstack/react-table";

import { useCallback, useMemo, useState } from "react";

import { Check, PlusCircle, XCircle } from "lucide-react";

import type { Option } from "@/shared/lib/data-table";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/shared/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Separator } from "@/shared/ui/separator";

import { ButtonGroup } from "../button-group";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: Option[];
  multiple?: boolean;
}

/**
 *
 */
export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  multiple,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const [open, setOpen] = useState(false);

  const columnFilterValue = column?.getFilterValue();
  const selectedValues = useMemo(
    () => new Set(Array.isArray(columnFilterValue) ? columnFilterValue : []),
    [columnFilterValue]
  );

  const onItemSelect = useCallback(
    (option: Option, isSelected: boolean) => {
      /* istanbul ignore next @preserve */
      if (column == null) return;

      /* istanbul ignore else @preserve */
      if (multiple) {
        const newSelectedValues = new Set(selectedValues);
        /* istanbul ignore next @preserve */
        if (isSelected) {
          newSelectedValues.delete(option.value);
        } else {
          newSelectedValues.add(option.value);
        }
        const filterValues = [...newSelectedValues];
        /* istanbul ignore next @preserve */
        column.setFilterValue(
          filterValues.length > 0 ? filterValues : undefined
        );
      } else {
        column.setFilterValue(isSelected ? undefined : [option.value]);
        setOpen(false);
      }
    },
    [column, multiple, selectedValues]
  );

  const onReset = useCallback(() => {
    column?.setFilterValue(undefined);
  }, [column]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {selectedValues.size > 0 ? (
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
            {title}
            <Separator
              orientation="vertical"
              className="mx-0.5 data-[orientation=vertical]:h-4
                data-[orientation=vertical]:self-center"
            />
            <Badge
              variant="secondary"
              className="rounded-sm px-1 font-normal lg:hidden"
            >
              {selectedValues.size}
            </Badge>
            <div className="hidden items-center gap-1 lg:flex">
              {selectedValues.size > 2 ? (
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {selectedValues.size} selected
                </Badge>
              ) : (
                options
                  .filter((option) => selectedValues.has(option.value))
                  .map((option) => (
                    <Badge
                      variant="secondary"
                      key={option.value}
                      className="rounded-sm px-1 font-normal"
                    >
                      {option.label}
                    </Badge>
                  ))
              )}
            </div>
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
          <PlusCircle />
          {title}
        </PopoverTrigger>
      )}
      <PopoverContent
        className="w-50 p-0"
        align="start"
        aria-label={`Filter by ${title}`}
      >
        <Command>
          <CommandInput placeholder={title} />
          <CommandList className="max-h-full">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup
              className="max-h-[300px] scroll-py-1 overflow-x-hidden
                overflow-y-auto"
            >
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);

                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => onItemSelect(option, isSelected)}
                  >
                    <div
                      className={cn(
                        `border-primary flex size-4 items-center justify-center
                        rounded-sm border`,
                        isSelected
                          ? `bg-primary text-primary-foreground
                            [&_svg]:text-primary-foreground!`
                          : "bg-inherit opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check />
                    </div>
                    {option.icon && <option.icon />}
                    <span className="truncate">{option.label}</span>
                    {option.count != null && (
                      <span className="ml-auto font-mono text-xs">
                        {option.count}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onReset()}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
