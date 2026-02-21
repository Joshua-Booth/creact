import type { ColumnDef } from "@tanstack/react-table";

import { useMemo } from "react";

import { useDataTable } from "@/shared/lib/data-table";

import type { Project } from "./data-table-demo";
import { DataTable } from "../data-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { projects } from "./data-table-demo";

// --- Demo ---

/** Table with non-sortable, non-hideable column headers rendered as plain text. */
export function NonSortableColumnDemo() {
  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable reference for table config
  const columns = useMemo<ColumnDef<Project>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="ID" />
        ),
        cell: ({ cell }) => cell.getValue<string>(),
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
        enableSorting: false,
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
      <DataTable table={table} />
    </div>
  );
}
