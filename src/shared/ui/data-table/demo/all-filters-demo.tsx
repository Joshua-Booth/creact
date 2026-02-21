import type { ColumnDef } from "@tanstack/react-table";

import { useMemo } from "react";

import { CalendarIcon, Text } from "lucide-react";

import { useDataTable } from "@/shared/lib/data-table";
import { Badge } from "@/shared/ui/badge";
import { Checkbox } from "@/shared/ui/checkbox";

import { DataTable } from "../data-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTableToolbar } from "../data-table-toolbar";
import {
  priorityIcons,
  priorityOptions,
  statusIcons,
  statusOptions,
} from "./data-table-demo";

// --- Types ---

interface FilterProject {
  id: string;
  title: string;
  status: "active" | "archived" | "draft";
  priority: "low" | "medium" | "high";
  budget: number;
  startDate: number;
  progress: number;
}

// --- Sample data ---

function createFilterProjects(): FilterProject[] {
  return [
    {
      id: "1",
      title: "Website Redesign",
      status: "active",
      priority: "high",
      budget: 12000,
      startDate: new Date(2026, 0, 15).getTime(),
      progress: 75,
    },
    {
      id: "2",
      title: "Mobile App",
      status: "active",
      priority: "high",
      budget: 45000,
      startDate: new Date(2026, 1, 1).getTime(),
      progress: 30,
    },
    {
      id: "3",
      title: "API Migration",
      status: "draft",
      priority: "medium",
      budget: 8000,
      startDate: new Date(2026, 2, 10).getTime(),
      progress: 0,
    },
    {
      id: "4",
      title: "Documentation",
      status: "active",
      priority: "low",
      budget: 3000,
      startDate: new Date(2026, 0, 5).getTime(),
      progress: 90,
    },
    {
      id: "5",
      title: "CI/CD Pipeline",
      status: "archived",
      priority: "medium",
      budget: 6000,
      startDate: new Date(2025, 10, 1).getTime(),
      progress: 100,
    },
    {
      id: "6",
      title: "Design System",
      status: "active",
      priority: "high",
      budget: 20000,
      startDate: new Date(2026, 3, 1).getTime(),
      progress: 10,
    },
    {
      id: "7",
      title: "Analytics Dashboard",
      status: "draft",
      priority: "medium",
      budget: 15000,
      startDate: new Date(2026, 4, 15).getTime(),
      progress: 0,
    },
    {
      id: "8",
      title: "Auth Service",
      status: "active",
      priority: "high",
      budget: 10000,
      startDate: new Date(2026, 1, 20).getTime(),
      progress: 55,
    },
    {
      id: "9",
      title: "Email Templates",
      status: "archived",
      priority: "low",
      budget: 2000,
      startDate: new Date(2025, 8, 1).getTime(),
      progress: 100,
    },
    {
      id: "10",
      title: "Performance Audit",
      status: "draft",
      priority: "medium",
      budget: 5000,
      startDate: new Date(2026, 5, 1).getTime(),
      progress: 0,
    },
  ];
}

// --- Demo ---

/** Project table showcasing all filter variants: text, number, range, date, select, and multiSelect. */
export function AllFiltersDemo() {
  const data = useMemo(() => createFilterProjects(), []);

  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable reference for table config
  const columns = useMemo<ColumnDef<FilterProject>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(value)}
            aria-label="Select row"
          />
        ),
        size: 32,
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "title",
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Title" />
        ),
        cell: ({ cell }) => (
          <div className="font-medium">
            {cell.getValue<FilterProject["title"]>()}
          </div>
        ),
        meta: {
          label: "Title",
          placeholder: "Search titles...",
          variant: "text",
          icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: "budget",
        accessorKey: "budget",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Budget" />
        ),
        cell: ({ cell }) => {
          const amount = cell.getValue<number>();
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(amount);
          return (
            <div className="text-right font-medium tabular-nums">
              {formatted}
            </div>
          );
        },
        size: 120,
        meta: {
          label: "Budget",
          placeholder: "Budget",
          variant: "number",
          unit: "$",
          unitPlacement: "prefix",
        },
        enableColumnFilter: true,
      },
      {
        id: "progress",
        accessorKey: "progress",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Progress" />
        ),
        cell: ({ cell }) => {
          const value = cell.getValue<number>();
          return <div className="text-right tabular-nums">{value}%</div>;
        },
        size: 100,
        meta: {
          label: "Progress",
          variant: "range",
          range: [0, 100] as [number, number],
          unit: "%",
        },
        enableColumnFilter: true,
      },
      {
        id: "startDate",
        accessorKey: "startDate",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Start Date" />
        ),
        cell: ({ cell }) => {
          const timestamp = cell.getValue<number>();
          return <div>{new Date(timestamp).toLocaleDateString("en-US")}</div>;
        },
        meta: {
          label: "Start Date",
          variant: "date",
          icon: CalendarIcon,
        },
        enableColumnFilter: true,
      },
      {
        id: "status",
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Status" />
        ),
        cell: ({ cell }) => {
          const status = cell.getValue<FilterProject["status"]>();
          const Icon = statusIcons[status];
          return (
            <Badge variant="outline" className="capitalize">
              <Icon className="size-3.5" />
              {status}
            </Badge>
          );
        },
        meta: {
          label: "Status",
          variant: "multiSelect",
          options: statusOptions,
        },
        enableColumnFilter: true,
      },
      {
        id: "priority",
        accessorKey: "priority",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Priority" />
        ),
        cell: ({ cell }) => {
          const priority = cell.getValue<FilterProject["priority"]>();
          const Icon = priorityIcons[priority];
          return (
            <div className="flex items-center gap-2 capitalize">
              <Icon className="text-muted-foreground size-3.5" />
              {priority}
            </div>
          );
        },
        meta: {
          label: "Priority",
          variant: "select",
          options: priorityOptions,
        },
        enableColumnFilter: true,
      },
    ],
    []
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: 1,
    getRowId: (row) => row.id,
    initialState: {
      sorting: [{ id: "title", desc: false }],
    },
  });

  return (
    <div className="w-full max-w-5xl">
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}
