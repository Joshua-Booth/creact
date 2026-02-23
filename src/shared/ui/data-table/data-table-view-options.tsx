import type { Table } from "@tanstack/react-table";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Check, Settings2 } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

interface DataTableViewOptionsProps<TData> extends React.ComponentProps<
  typeof PopoverContent
> {
  /** TanStack Table instance for toggling column visibility. */
  table: Table<TData>;
}

/** Column visibility toggle popover with searchable column list. */
export function DataTableViewOptions<TData>({
  table,
  ...props
}: DataTableViewOptionsProps<TData>) {
  const { t } = useTranslation("components");

  const columns = useMemo(
    () =>
      table
        .getAllColumns()
        .filter(
          (column) => column.accessorFn !== undefined && column.getCanHide()
        ),
    [table]
  );

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            aria-label={t("dataTable.toggleColumns")}
            role="combobox"
            variant="outline"
            size="sm"
            className="ml-auto hidden h-8 font-normal lg:flex"
          />
        }
      >
        <Settings2 className="text-muted-foreground" />
        {t("dataTable.view")}
      </PopoverTrigger>
      <PopoverContent
        className="w-44 p-0"
        aria-label={t("dataTable.toggleColumns")}
        {...props}
      >
        <Command>
          <CommandInput placeholder={t("dataTable.searchColumns")} />
          <CommandList>
            <CommandEmpty>{t("dataTable.noColumnsFound")}</CommandEmpty>
            <CommandGroup>
              {columns.map((column) => (
                <CommandItem
                  key={column.id}
                  onSelect={() =>
                    column.toggleVisibility(!column.getIsVisible())
                  }
                >
                  <span className="truncate">
                    {column.columnDef.meta?.label ?? column.id}
                  </span>
                  <Check
                    className={cn(
                      "ml-auto size-4 shrink-0",
                      column.getIsVisible() ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
