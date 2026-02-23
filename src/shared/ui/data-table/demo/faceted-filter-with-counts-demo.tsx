import type { ColumnDef } from "@tanstack/react-table";

import { useMemo } from "react";

import { CheckCircle2, CircleDashed, Text, XCircle } from "lucide-react";

import { useDataTable } from "@/shared/lib/data-table";

import type { Project } from "./data-table-demo";
import { DataTable } from "../data-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTableToolbar } from "../data-table-toolbar";
import { projects } from "./data-table-demo";

// --- Options ---

const statusOptionsWithCounts = [
  { label: "Active", value: "active", icon: CheckCircle2, count: 5 },
  { label: "Draft", value: "draft", icon: CircleDashed, count: 3 },
  { label: "Archived", value: "archived", icon: XCircle, count: 2 },
];

// --- Demo ---

/** Table with faceted filter options that display count badges. */
export function FacetedFilterWithCountsDemo() {
  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable reference for table config
  const columns = useMemo<ColumnDef<Project>[]>(
    () => [
      {
        id: "title",
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Title" />
        ),
        cell: ({ cell }) => (
          <div className="font-medium">{cell.getValue<string>()}</div>
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
        cell: ({ cell }) => cell.getValue<string>(),
        meta: {
          label: "Status",
          variant: "multiSelect",
          options: statusOptionsWithCounts,
        },
        enableColumnFilter: true,
      },
    ],
    []
  );

  const { table } = useDataTable({
    data: projects,
    columns,
    pageCount: 1,
    getRowId: (row) => row.id,
  });

  return (
    <div className="w-full max-w-4xl">
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}
