import type { ColumnDef } from "@tanstack/react-table";

import { useMemo, useState } from "react";

import preview from "@/storybook/preview";

import { useDataGrid } from "@/shared/lib/data-grid";

import { DataGrid } from "./data-grid";
import { DataGridKeyboardShortcuts } from "./data-grid-keyboard-shortcuts";

// --- Types ---

interface Task {
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

function createSampleData(): Task[] {
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

// --- Story setup ---

const meta = preview.meta({
  title: "ui/DataGrid",
  component: DataGridDemo,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Spreadsheet-like editable data grid with virtualization, clipboard support, and undo/redo.",
      },
    },
  },
  args: {
    readOnly: false,
  },
});

// --- Stories ---

/** Editable data grid with multiple cell variants. */
export const Default = meta.story({
  render: (args) => <DataGridDemo {...args} />,
});

/** Read-only data grid. */
export const ReadOnly = meta.story({
  args: { readOnly: true },
  render: (args) => <DataGridDemo {...args} />,
});

function DataGridDemo({ readOnly = false }: { readOnly?: boolean }) {
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
    <div className="w-full max-w-5xl">
      <DataGridKeyboardShortcuts enableSearch={!!dataGridProps.searchState} />
      <DataGrid {...dataGridProps} table={table} height={400} />
    </div>
  );
}
