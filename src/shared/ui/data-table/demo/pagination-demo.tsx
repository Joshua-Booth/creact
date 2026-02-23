import type { ColumnDef } from "@tanstack/react-table";

import { useMemo } from "react";

import { useDataTable } from "@/shared/lib/data-table";
import { Badge } from "@/shared/ui/badge";

import type { Project } from "./data-table-demo";
import { DataTable } from "../data-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { statusIcons } from "./data-table-demo";

// --- Sample data ---

function createPaginationData(): Project[] {
  return Array.from({ length: 35 }, (_, i) => ({
    id: String(i + 1),
    title: `Project ${i + 1}`,
    status: (["active", "archived", "draft"] as const)[i % 3] ?? "active",
    priority: (["low", "medium", "high"] as const)[i % 3] ?? "medium",
    budget: (i + 1) * 1000,
  }));
}

// --- Demo ---

/** Table with 35 generated rows demonstrating multi-page pagination controls. */
export function PaginationDemo() {
  const data = useMemo(() => createPaginationData(), []);

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
        cell: ({ cell }) => {
          const status = cell.getValue<Project["status"]>();
          const Icon = statusIcons[status];
          return (
            <Badge variant="outline" className="capitalize">
              <Icon className="size-3.5" />
              {status}
            </Badge>
          );
        },
        meta: { label: "Status" },
      },
      {
        id: "budget",
        accessorKey: "budget",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Budget" />
        ),
        cell: ({ cell }) => {
          const amount = cell.getValue<number>();
          return (
            <div className="text-right font-medium tabular-nums">
              ${amount.toLocaleString()}
            </div>
          );
        },
        size: 120,
        meta: { label: "Budget" },
      },
    ],
    []
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: Math.ceil(data.length / 10),
    getRowId: (row) => row.id,
    initialState: {
      sorting: [{ id: "title", desc: false }],
    },
  });

  return (
    <div className="w-full max-w-4xl">
      <DataTable table={table} />
    </div>
  );
}
