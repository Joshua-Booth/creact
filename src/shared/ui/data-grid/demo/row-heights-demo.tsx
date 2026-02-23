import type { ColumnDef } from "@tanstack/react-table";

import { useMemo, useState } from "react";

import { useDataGrid } from "@/shared/lib/data-grid";

import type { Task } from "./data-grid-demo";
import { DataGrid } from "../data-grid";
import { createSampleData, DataGridToolbar } from "./data-grid-demo";

// --- Demo component ---

/** Grid with tall row height. */
export function RowHeightsDemo({ readOnly = false }: { readOnly?: boolean }) {
  const [data, setData] = useState(createSampleData);

  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable column definitions
  const columns = useMemo<ColumnDef<Task>[]>(
    () => [
      {
        id: "title",
        accessorKey: "title",
        header: "Title",
        meta: { label: "Title", cell: { variant: "short-text" as const } },
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
        id: "assignee",
        accessorKey: "assignee",
        header: "Assignee",
        meta: { label: "Assignee", cell: { variant: "short-text" as const } },
        minSize: 130,
      },
      {
        id: "dueDate",
        accessorKey: "dueDate",
        header: "Due Date",
        meta: { label: "Due Date", cell: { variant: "date" as const } },
        minSize: 130,
      },
    ],
    []
  );

  const { table, ...dataGridProps } = useDataGrid({
    columns,
    data,
    onDataChange: setData,
    getRowId: (row) => row.id,
    rowHeight: "tall",
    readOnly,
  });

  return (
    <div className="w-full max-w-4xl space-y-2">
      <DataGridToolbar table={table} enableRowHeight enableView />
      <DataGrid {...dataGridProps} table={table} height={500} />
    </div>
  );
}
