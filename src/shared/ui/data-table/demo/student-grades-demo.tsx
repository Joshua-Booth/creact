import type { ColumnDef } from "@tanstack/react-table";

import { useMemo } from "react";

import { CalendarIcon, Text } from "lucide-react";

import { useDataTable } from "@/shared/lib/data-table";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Checkbox } from "@/shared/ui/checkbox";

import { DataTable } from "../data-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTableToolbar } from "../data-table-toolbar";

// --- Types ---

interface Student {
  id: string;
  name: string;
  grade: string;
  math: number;
  science: number;
  english: number;
  history: number;
  average: number;
  passing: boolean;
  enrolledDate: number;
}

// --- Sample data ---

function createStudentData(): Student[] {
  const students = [
    {
      id: "1",
      name: "Aiden Brooks",
      grade: "Senior",
      math: 92,
      science: 88,
      english: 78,
      history: 85,
      enrolledDate: new Date(2022, 8, 1).getTime(),
    },
    {
      id: "2",
      name: "Maya Singh",
      grade: "Junior",
      math: 98,
      science: 95,
      english: 92,
      history: 90,
      enrolledDate: new Date(2023, 8, 1).getTime(),
    },
    {
      id: "3",
      name: "Carlos Reyes",
      grade: "Sophomore",
      math: 55,
      science: 62,
      english: 70,
      history: 58,
      enrolledDate: new Date(2024, 8, 1).getTime(),
    },
    {
      id: "4",
      name: "Lily Nakamura",
      grade: "Senior",
      math: 74,
      science: 80,
      english: 88,
      history: 82,
      enrolledDate: new Date(2022, 8, 1).getTime(),
    },
    {
      id: "5",
      name: "Ethan Park",
      grade: "Freshman",
      math: 45,
      science: 52,
      english: 58,
      history: 48,
      enrolledDate: new Date(2025, 8, 1).getTime(),
    },
    {
      id: "6",
      name: "Zara Ahmed",
      grade: "Junior",
      math: 88,
      science: 91,
      english: 85,
      history: 93,
      enrolledDate: new Date(2023, 8, 1).getTime(),
    },
    {
      id: "7",
      name: "Finn O'Brien",
      grade: "Sophomore",
      math: 65,
      science: 58,
      english: 72,
      history: 60,
      enrolledDate: new Date(2024, 8, 1).getTime(),
    },
    {
      id: "8",
      name: "Isabella Costa",
      grade: "Senior",
      math: 95,
      science: 98,
      english: 90,
      history: 94,
      enrolledDate: new Date(2022, 8, 1).getTime(),
    },
    {
      id: "9",
      name: "Noah Kim",
      grade: "Freshman",
      math: 78,
      science: 72,
      english: 68,
      history: 75,
      enrolledDate: new Date(2025, 8, 1).getTime(),
    },
    {
      id: "10",
      name: "Harper Lee",
      grade: "Junior",
      math: 82,
      science: 76,
      english: 95,
      history: 88,
      enrolledDate: new Date(2023, 8, 1).getTime(),
    },
    {
      id: "11",
      name: "Jamal Washington",
      grade: "Sophomore",
      math: 70,
      science: 68,
      english: 62,
      history: 71,
      enrolledDate: new Date(2024, 8, 1).getTime(),
    },
    {
      id: "12",
      name: "Mia Petrov",
      grade: "Freshman",
      math: 58,
      science: 55,
      english: 64,
      history: 52,
      enrolledDate: new Date(2025, 8, 1).getTime(),
    },
  ];
  return students.map((s) => {
    const avg = Math.round((s.math + s.science + s.english + s.history) / 4);
    return { ...s, average: avg, passing: avg >= 60 };
  });
}

// --- Options ---

const gradeOptions = [
  { label: "Freshman", value: "Freshman" },
  { label: "Sophomore", value: "Sophomore" },
  { label: "Junior", value: "Junior" },
  { label: "Senior", value: "Senior" },
];

// --- Helpers ---

function averageColor(avg: number): string {
  if (avg < 60) return "text-red-700 dark:text-red-400";
  if (avg < 80) return "text-amber-800 dark:text-yellow-400";
  return "text-green-800 dark:text-green-400";
}

// --- Demo ---

/** Student gradebook table with conditional styling, pass/fail badges, and multiple range filters. */
export function StudentGradesDemo() {
  const data = useMemo(() => createStudentData(), []);

  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable reference for table config
  const columns = useMemo<ColumnDef<Student>[]>(
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
        id: "name",
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Student" />
        ),
        cell: ({ row, cell }) => {
          const passing = row.original.passing;
          return (
            <div
              className={cn(
                "border-l-4 pl-2 font-medium",
                passing ? "border-l-green-500" : "border-l-red-500"
              )}
            >
              {cell.getValue<string>()}
            </div>
          );
        },
        meta: {
          label: "Student",
          placeholder: "Search students...",
          variant: "text",
          icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: "grade",
        accessorKey: "grade",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Year" />
        ),
        cell: ({ cell }) => (
          <Badge variant="outline">{cell.getValue<string>()}</Badge>
        ),
        meta: {
          label: "Year",
          variant: "select",
          options: gradeOptions,
        },
        enableColumnFilter: true,
      },
      {
        id: "math",
        accessorKey: "math",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Math" />
        ),
        cell: ({ cell }) => (
          <div className="text-right tabular-nums">
            {cell.getValue<number>()}
          </div>
        ),
        meta: {
          label: "Math",
          variant: "range",
          range: [0, 100] as [number, number],
        },
        enableColumnFilter: true,
      },
      {
        id: "science",
        accessorKey: "science",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Science" />
        ),
        cell: ({ cell }) => (
          <div className="text-right tabular-nums">
            {cell.getValue<number>()}
          </div>
        ),
      },
      {
        id: "english",
        accessorKey: "english",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="English" />
        ),
        cell: ({ cell }) => (
          <div className="text-right tabular-nums">
            {cell.getValue<number>()}
          </div>
        ),
      },
      {
        id: "history",
        accessorKey: "history",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="History" />
        ),
        cell: ({ cell }) => (
          <div className="text-right tabular-nums">
            {cell.getValue<number>()}
          </div>
        ),
      },
      {
        id: "average",
        accessorKey: "average",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Average" />
        ),
        cell: ({ cell }) => {
          const avg = cell.getValue<number>();
          return (
            <div
              className={`text-right font-bold tabular-nums
                ${averageColor(avg)}`}
            >
              {avg}
            </div>
          );
        },
        meta: {
          label: "Average",
          variant: "range",
          range: [0, 100] as [number, number],
        },
        enableColumnFilter: true,
      },
      {
        id: "passing",
        accessorKey: "passing",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Passing" />
        ),
        cell: ({ cell }) => {
          const pass = cell.getValue<boolean>();
          return (
            <Badge variant={pass ? "default" : "destructive"}>
              {pass ? "Pass" : "Fail"}
            </Badge>
          );
        },
        meta: {
          label: "Passing",
          variant: "boolean",
        },
        enableColumnFilter: true,
      },
      {
        id: "enrolledDate",
        accessorKey: "enrolledDate",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Enrolled" />
        ),
        cell: ({ cell }) => (
          <div>
            {new Date(cell.getValue<number>()).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
            })}
          </div>
        ),
        meta: {
          label: "Enrolled",
          variant: "date",
          icon: CalendarIcon,
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
      sorting: [{ id: "name", desc: false }],
    },
  });

  return (
    <div className="w-full max-w-6xl">
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}
