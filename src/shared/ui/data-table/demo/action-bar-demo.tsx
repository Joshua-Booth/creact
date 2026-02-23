import type { ColumnDef } from "@tanstack/react-table";

import { useMemo } from "react";

import { useDataTable } from "@/shared/lib/data-table";
import { Checkbox } from "@/shared/ui/checkbox";

import type { Project } from "./data-table-demo";
import { DataTable } from "../data-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { projects } from "./data-table-demo";

// --- Demo ---

/** Table with an action bar that appears when rows are selected. */
export function ActionBarDemo() {
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
      <DataTable
        table={table}
        actionBar={
          <div className="bg-muted rounded-md p-2 text-center text-sm">
            Delete selected
          </div>
        }
      />
    </div>
  );
}
