import type { ColumnDef, Table } from "@tanstack/react-table";

import { useMemo, useState } from "react";

import {
  ArrowUpDown,
  Check,
  ChevronDown,
  ChevronUp,
  Columns3,
  Filter,
  Rows3,
  X,
} from "lucide-react";

import type { CellSelectOption, RowHeightValue } from "@/shared/lib/data-grid";
import { useDataGrid } from "@/shared/lib/data-grid";
import { Badge } from "@/shared/ui/badge";
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
import { Separator } from "@/shared/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";

import { DataGrid } from "../data-grid";
import { DataGridKeyboardShortcuts } from "../data-grid-keyboard-shortcuts";

// --- Types ---

export interface Task {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  assignee: string;
  completed: boolean;
  effort: number;
  dueDate: string;
}

// --- Sample data ---

/** Eight sample tasks spanning common statuses, priorities, and assignees. */
export function createSampleData(): Task[] {
  return [
    {
      id: "1",
      title: "Set up CI/CD pipeline",
      status: "done",
      priority: "high",
      assignee: "Alice",
      completed: true,
      effort: 8,
      dueDate: "2026-01-15",
    },
    {
      id: "2",
      title: "Design landing page",
      status: "in-progress",
      priority: "medium",
      assignee: "Bob",
      completed: false,
      effort: 5,
      dueDate: "2026-02-01",
    },
    {
      id: "3",
      title: "Write unit tests",
      status: "todo",
      priority: "high",
      assignee: "Charlie",
      completed: false,
      effort: 13,
      dueDate: "2026-02-20",
    },
    {
      id: "4",
      title: "Update documentation",
      status: "todo",
      priority: "low",
      assignee: "Alice",
      completed: false,
      effort: 3,
      dueDate: "2026-03-01",
    },
    {
      id: "5",
      title: "Fix login bug",
      status: "in-progress",
      priority: "high",
      assignee: "Bob",
      completed: false,
      effort: 2,
      dueDate: "2026-01-28",
    },
    {
      id: "6",
      title: "Add dark mode support",
      status: "todo",
      priority: "medium",
      assignee: "Charlie",
      completed: false,
      effort: 8,
      dueDate: "2026-03-15",
    },
    {
      id: "7",
      title: "Optimize bundle size",
      status: "done",
      priority: "medium",
      assignee: "Alice",
      completed: true,
      effort: 5,
      dueDate: "2026-01-10",
    },
    {
      id: "8",
      title: "Implement search",
      status: "in-progress",
      priority: "high",
      assignee: "Bob",
      completed: false,
      effort: 8,
      dueDate: "2026-02-10",
    },
  ];
}

// --- Toolbar ---

const ROW_HEIGHT_LABELS: Record<RowHeightValue, string> = {
  short: "Short",
  medium: "Medium",
  tall: "Tall",
  "extra-tall": "Extra Tall",
};

interface DataGridToolbarProps<TData> {
  table: Table<TData>;
  enableSort?: boolean;
  enableFilter?: boolean;
  enableRowHeight?: boolean;
  enableView?: boolean;
}

/** Configurable toolbar for DataGrid demos with sort, filter, row-height, and column-visibility controls. */
export function DataGridToolbar<TData>({
  table,
  enableSort = false,
  enableFilter = false,
  enableRowHeight = false,
  enableView = false,
}: DataGridToolbarProps<TData>) {
  const meta = table.options.meta;
  const rowHeight = meta?.rowHeight;
  const onRowHeightChange = meta?.onRowHeightChange;

  return (
    <div className="flex items-center gap-1">
      {enableSort && <SortControl table={table} />}
      {enableFilter && <FilterControl table={table} />}
      {enableRowHeight && rowHeight != null && onRowHeightChange != null && (
        <RowHeightControl value={rowHeight} onChange={onRowHeightChange} />
      )}
      {enableView && <ViewControl table={table} />}
    </div>
  );
}

function SortControl<TData>({ table }: { table: Table<TData> }) {
  const sorting = table.getState().sorting;
  const [open, setOpen] = useState(false);

  const sortableColumns = table
    .getAllColumns()
    .filter((col) => col.getCanSort());

  function toggleColumnSort(columnId: string) {
    const existing = sorting.find((s) => s.id === columnId);
    if (!existing) {
      table.setSorting([...sorting, { id: columnId, desc: false }]);
    } else if (existing.desc) {
      table.setSorting(sorting.filter((s) => s.id !== columnId));
    } else {
      table.setSorting(
        sorting.map((s) => (s.id === columnId ? { ...s, desc: true } : s))
      );
    }
  }

  function removeSort(columnId: string) {
    table.setSorting(sorting.filter((s) => s.id !== columnId));
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <ArrowUpDown className="size-3.5" />
            Sort
            {sorting.length > 0 && (
              <Badge variant="secondary" className="px-1 text-xs">
                {sorting.length}
              </Badge>
            )}
          </Button>
        }
      />
      <PopoverContent className="w-56 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search columns..." />
          <CommandList>
            <CommandEmpty>No columns found.</CommandEmpty>
            <CommandGroup>
              {sortableColumns.map((col) => {
                const active = sorting.find((s) => s.id === col.id);
                const label = col.columnDef.meta?.label ?? col.id;
                return (
                  <CommandItem
                    key={col.id}
                    value={label}
                    onSelect={() => toggleColumnSort(col.id)}
                    className="flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      {!active && <span className="size-3.5" />}
                      {active?.desc === true && (
                        <ChevronDown className="size-3.5" />
                      )}
                      {active?.desc === false && (
                        <ChevronUp className="size-3.5" />
                      )}
                      {label}
                    </span>
                    {active && (
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground
                          ml-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSort(col.id);
                        }}
                      >
                        <X className="size-3.5" />
                      </button>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface FilterableColumn {
  id: string;
  label: string;
  options: CellSelectOption[];
}

function getFilterableColumns<TData>(table: Table<TData>): FilterableColumn[] {
  return table
    .getAllColumns()
    .filter((col) => {
      const cell = col.columnDef.meta?.cell;
      if (!cell) return false;
      return (
        (cell.variant === "select" || cell.variant === "multi-select") &&
        "options" in cell &&
        cell.options.length > 0
      );
    })
    .map((col) => {
      const cell = col.columnDef.meta?.cell as {
        variant: "select" | "multi-select";
        options: CellSelectOption[];
      };
      return {
        id: col.id,
        label: col.columnDef.meta?.label ?? col.id,
        options: cell.options,
      };
    });
}

function FilterControl<TData>({ table }: { table: Table<TData> }) {
  const columnFilters = table.getState().columnFilters;
  const [open, setOpen] = useState(false);
  const [expandedColumn, setExpandedColumn] = useState<string | null>(null);

  const filterableColumns = getFilterableColumns(table);

  const activeFilterCount = columnFilters.filter((f) => {
    const val = f.value;
    if (Array.isArray(val)) return val.length > 0;
    return val != null && val !== "";
  }).length;

  function toggleFilterOption(columnId: string, optionValue: string) {
    const column = table.getColumn(columnId);
    if (!column) return;

    const current = (column.getFilterValue() as string[] | undefined) ?? [];
    const next = current.includes(optionValue)
      ? current.filter((v) => v !== optionValue)
      : [...current, optionValue];
    column.setFilterValue(next.length > 0 ? next : undefined);
  }

  function resetFilters() {
    table.resetColumnFilters();
  }

  if (filterableColumns.length === 0) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="size-3.5" />
            Filter
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="px-1 text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        }
      />
      <PopoverContent className="w-56 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search filters..." />
          <CommandList>
            <CommandEmpty>No filters found.</CommandEmpty>
            <CommandGroup>
              {filterableColumns.map((fc) => {
                const isExpanded = expandedColumn === fc.id;
                const currentValues =
                  (table.getColumn(fc.id)?.getFilterValue() as
                    | string[]
                    | undefined) ?? [];

                return (
                  <div key={fc.id}>
                    <CommandItem
                      value={fc.label}
                      onSelect={() =>
                        setExpandedColumn(isExpanded ? null : fc.id)
                      }
                      className="flex items-center justify-between"
                    >
                      <span>{fc.label}</span>
                      <span className="flex items-center gap-1">
                        {currentValues.length > 0 && (
                          <Badge variant="secondary" className="px-1 text-xs">
                            {currentValues.length}
                          </Badge>
                        )}
                        <ChevronDown
                          className={`size-3.5 transition-transform
                          ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </span>
                    </CommandItem>
                    {isExpanded &&
                      fc.options.map((opt) => {
                        const isSelected = currentValues.includes(opt.value);
                        return (
                          <CommandItem
                            key={opt.value}
                            value={`${fc.label} ${opt.label}`}
                            onSelect={() =>
                              toggleFilterOption(fc.id, opt.value)
                            }
                            className="pl-6"
                          >
                            <span className="flex items-center gap-2">
                              {isSelected ? (
                                <Check className="size-3.5" />
                              ) : (
                                <span className="size-3.5" />
                              )}
                              {opt.label}
                            </span>
                          </CommandItem>
                        );
                      })}
                  </div>
                );
              })}
            </CommandGroup>
            {activeFilterCount > 0 && (
              <>
                <Separator />
                <CommandGroup>
                  <CommandItem
                    onSelect={resetFilters}
                    className="justify-center text-center"
                  >
                    Reset filters
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

function RowHeightControl({
  value,
  onChange,
}: {
  value: RowHeightValue;
  onChange: (value: RowHeightValue) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Rows3 className="size-3.5" />
            {ROW_HEIGHT_LABELS[value]}
          </Button>
        }
      />
      <PopoverContent className="w-40 p-2" align="start">
        <ToggleGroup
          value={[value]}
          onValueChange={(newValue: unknown) => {
            const values = newValue as string[];
            const selected = values[0] as RowHeightValue | undefined;
            if (selected != null) {
              onChange(selected);
              setOpen(false);
            }
          }}
          orientation="vertical"
          className="w-full flex-col"
        >
          {(
            Object.entries(ROW_HEIGHT_LABELS) as [RowHeightValue, string][]
          ).map(([key, label]) => (
            <ToggleGroupItem
              key={key}
              value={key}
              className="w-full justify-start"
              size="sm"
            >
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </PopoverContent>
    </Popover>
  );
}

function ViewControl<TData>({ table }: { table: Table<TData> }) {
  const [open, setOpen] = useState(false);

  const hideableColumns = table
    .getAllColumns()
    .filter((col) => col.getCanHide());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Columns3 className="size-3.5" />
            View
          </Button>
        }
      />
      <PopoverContent className="w-56 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search columns..." />
          <CommandList>
            <CommandEmpty>No columns found.</CommandEmpty>
            <CommandGroup>
              {hideableColumns.map((col) => {
                const isVisible = col.getIsVisible();
                const label = col.columnDef.meta?.label ?? col.id;
                return (
                  <CommandItem
                    key={col.id}
                    value={label}
                    onSelect={() => col.toggleVisibility(!isVisible)}
                  >
                    <span className="flex items-center gap-2">
                      {isVisible ? (
                        <Check className="size-3.5" />
                      ) : (
                        <span className="size-3.5" />
                      )}
                      {label}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// --- Main demo ---

/** Editable task-tracking grid with sort, filter, row-height, and column-visibility toolbar controls. */
export function DataGridDemo({ readOnly = false }: { readOnly?: boolean }) {
  const [data, setData] = useState(createSampleData);

  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable column definitions
  const columns = useMemo<ColumnDef<Task>[]>(
    () => [
      {
        id: "title",
        accessorKey: "title",
        header: "Title",
        meta: {
          label: "Title",
          cell: { variant: "short-text" as const },
        },
        minSize: 200,
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        meta: {
          label: "Status",
          cell: {
            variant: "select" as const,
            options: [
              { label: "To Do", value: "todo" },
              { label: "In Progress", value: "in-progress" },
              { label: "Done", value: "done" },
            ],
          },
        },
        minSize: 130,
      },
      {
        id: "priority",
        accessorKey: "priority",
        header: "Priority",
        meta: {
          label: "Priority",
          cell: {
            variant: "select" as const,
            options: [
              { label: "Low", value: "low" },
              { label: "Medium", value: "medium" },
              { label: "High", value: "high" },
            ],
          },
        },
        minSize: 120,
      },
      {
        id: "assignee",
        accessorKey: "assignee",
        header: "Assignee",
        meta: {
          label: "Assignee",
          cell: { variant: "short-text" as const },
        },
        minSize: 130,
      },
      {
        id: "completed",
        accessorKey: "completed",
        header: "Done",
        meta: {
          label: "Done",
          cell: { variant: "checkbox" as const },
        },
        minSize: 80,
      },
      {
        id: "effort",
        accessorKey: "effort",
        header: "Effort (pts)",
        meta: {
          label: "Effort",
          cell: {
            variant: "number" as const,
            min: 1,
            max: 100,
          },
        },
        minSize: 110,
      },
      {
        id: "dueDate",
        accessorKey: "dueDate",
        header: "Due Date",
        meta: {
          label: "Due Date",
          cell: { variant: "date" as const },
        },
        minSize: 130,
      },
    ],
    []
  );

  const onRowAdd = () => {
    const newRow: Task = {
      id: String(Date.now()),
      title: "",
      status: "todo",
      priority: "medium",
      assignee: "",
      completed: false,
      effort: 1,
      dueDate: new Date().toISOString().split("T")[0] ?? "",
    };
    setData((prev) => [...prev, newRow]);
    return null;
  };

  const { table, ...dataGridProps } = useDataGrid({
    columns,
    data,
    onDataChange: setData,
    onRowAdd: readOnly ? undefined : onRowAdd,
    getRowId: (row) => row.id,
    enableSearch: true,
    enablePaste: !readOnly,
    readOnly,
  });

  return (
    <div className="w-full max-w-5xl space-y-2">
      <DataGridToolbar
        table={table}
        enableSort
        enableFilter
        enableRowHeight
        enableView
      />
      <DataGridKeyboardShortcuts enableSearch={!!dataGridProps.searchState} />
      <DataGrid {...dataGridProps} table={table} height={400} />
    </div>
  );
}
