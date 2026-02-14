import type { ColumnDef } from "@tanstack/react-table";

import { useMemo } from "react";

import preview from "@/storybook/preview";
import { CheckCircle2, CircleDashed, Clock, Text, XCircle } from "lucide-react";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";

import { useDataTable } from "@/shared/lib/data-table";
import { Badge } from "@/shared/ui/badge";
import { Checkbox } from "@/shared/ui/checkbox";

import { DataTable } from "./data-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableToolbar } from "./data-table-toolbar";

// --- Types ---

interface Project {
  id: string;
  title: string;
  status: "active" | "archived" | "draft";
  priority: "low" | "medium" | "high";
  budget: number;
}

// --- Sample data ---

const projects: Project[] = [
  {
    id: "1",
    title: "Website Redesign",
    status: "active",
    priority: "high",
    budget: 12000,
  },
  {
    id: "2",
    title: "Mobile App",
    status: "active",
    priority: "high",
    budget: 45000,
  },
  {
    id: "3",
    title: "API Migration",
    status: "draft",
    priority: "medium",
    budget: 8000,
  },
  {
    id: "4",
    title: "Documentation",
    status: "active",
    priority: "low",
    budget: 3000,
  },
  {
    id: "5",
    title: "CI/CD Pipeline",
    status: "archived",
    priority: "medium",
    budget: 6000,
  },
  {
    id: "6",
    title: "Design System",
    status: "active",
    priority: "high",
    budget: 20000,
  },
  {
    id: "7",
    title: "Analytics Dashboard",
    status: "draft",
    priority: "medium",
    budget: 15000,
  },
  {
    id: "8",
    title: "Auth Service",
    status: "active",
    priority: "high",
    budget: 10000,
  },
  {
    id: "9",
    title: "Email Templates",
    status: "archived",
    priority: "low",
    budget: 2000,
  },
  {
    id: "10",
    title: "Performance Audit",
    status: "draft",
    priority: "medium",
    budget: 5000,
  },
  {
    id: "11",
    title: "Localization",
    status: "active",
    priority: "low",
    budget: 7000,
  },
  {
    id: "12",
    title: "Database Optimization",
    status: "active",
    priority: "high",
    budget: 9000,
  },
];

// --- Story setup ---

const meta = preview.meta({
  title: "ui/DataTable",
  component: DataTableDemo,
  decorators: [
    (Story) => (
      <NuqsAdapter>
        <Story />
      </NuqsAdapter>
    ),
  ],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Feature-rich read-focused data table with sorting, filtering, pagination, and row selection.",
      },
    },
  },
});

// --- Stories ---

/** Data table with sorting, filtering, and pagination. */
export const Default = meta.story({
  render: (args) => <DataTableDemo {...args} />,
});

function DataTableDemo() {
  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable reference for table config
  const columns = useMemo<ColumnDef<Project>[]>(
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
          <div className="font-medium">{cell.getValue<Project["title"]>()}</div>
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
        id: "status",
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Status" />
        ),
        cell: ({ cell }) => {
          const status = cell.getValue<Project["status"]>();
          const icons = {
            active: CheckCircle2,
            draft: CircleDashed,
            archived: XCircle,
          };
          const Icon = icons[status];
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
          options: [
            { label: "Active", value: "active", icon: CheckCircle2 },
            { label: "Draft", value: "draft", icon: CircleDashed },
            { label: "Archived", value: "archived", icon: XCircle },
          ],
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
          const priority = cell.getValue<Project["priority"]>();
          const icons = {
            low: CircleDashed,
            medium: Clock,
            high: CheckCircle2,
          };
          const Icon = icons[priority];
          return (
            <div className="flex items-center gap-2 capitalize">
              <Icon className="text-muted-foreground size-3.5" />
              {priority}
            </div>
          );
        },
        meta: {
          label: "Priority",
          variant: "multiSelect",
          options: [
            { label: "Low", value: "low", icon: CircleDashed },
            { label: "Medium", value: "medium", icon: Clock },
            { label: "High", value: "high", icon: CheckCircle2 },
          ],
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
          return <div className="text-right font-medium">{formatted}</div>;
        },
      },
    ],
    []
  );

  const { table } = useDataTable({
    data: projects,
    columns,
    pageCount: 1,
    getRowId: (row) => row.id,
    initialState: {
      sorting: [{ id: "title", desc: false }],
    },
  });

  return (
    <div className="w-full max-w-4xl">
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}
