import type { ColumnDef } from "@tanstack/react-table";

import { useMemo, useState } from "react";

import { useDataGrid } from "@/shared/lib/data-grid";

import type { Task } from "./data-grid-demo";
import { DataGrid } from "../data-grid";
import { DataGridToolbar } from "./data-grid-demo";

// --- Sample data ---

function createLargeDataset(): Task[] {
  const statuses: Task["status"][] = ["todo", "in-progress", "done"];
  const priorities: Task["priority"][] = ["low", "medium", "high"];
  const assignees = ["Alice", "Bob", "Charlie", "Diana", "Eve"];
  return Array.from({ length: 500 }, (_, i) => ({
    id: String(i + 1),
    title: `Task ${i + 1}: ${["Implement", "Fix", "Refactor", "Test", "Document"][i % 5]} ${["auth", "API", "UI", "build", "deploy"][i % 5]}`,
    status: statuses[i % 3] ?? "todo",
    priority: priorities[i % 3] ?? "medium",
    assignee: assignees[i % 5] ?? "Alice",
    completed: i % 4 === 0,
    effort: (i % 13) + 1,
    dueDate: `2026-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
  }));
}

// --- Demo component ---

/** Virtualized grid with 500 rows. */
export function LargeDatasetDemo({ readOnly = false }: { readOnly?: boolean }) {
  const [data, setData] = useState(createLargeDataset);

  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable column definitions
  const columns = useMemo<ColumnDef<Task>[]>(
    () => [
      {
        id: "title",
        accessorKey: "title",
        header: "Title",
        meta: { label: "Title", cell: { variant: "short-text" as const } },
        minSize: 250,
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
        meta: { label: "Assignee", cell: { variant: "short-text" as const } },
        minSize: 130,
      },
      {
        id: "effort",
        accessorKey: "effort",
        header: "Effort",
        meta: {
          label: "Effort",
          cell: { variant: "number" as const, min: 1, max: 100 },
        },
        minSize: 100,
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
    enableSearch: true,
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
      <DataGrid {...dataGridProps} table={table} height={500} />
    </div>
  );
}
