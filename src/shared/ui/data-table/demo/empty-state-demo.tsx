import type { ColumnDef } from "@tanstack/react-table";

import { useMemo } from "react";

import { useDataTable } from "@/shared/lib/data-table";

import type { Project } from "./data-table-demo";
import { DataTable } from "../data-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTableToolbar } from "../data-table-toolbar";

// --- Demo ---

/** Table with an empty data array to demonstrate the "No results" state. */
export function EmptyStateDemo() {
  const emptyData: Project[] = [];

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
        meta: { label: "Title" },
      },
      {
        id: "status",
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Status" />
        ),
        cell: ({ cell }) => cell.getValue<string>(),
        meta: { label: "Status" },
      },
      {
        id: "budget",
        accessorKey: "budget",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Budget" />
        ),
        cell: ({ cell }) => cell.getValue<string>(),
        meta: { label: "Budget" },
      },
    ],
    []
  );

  const { table } = useDataTable({
    data: emptyData,
    columns,
    pageCount: 0,
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
