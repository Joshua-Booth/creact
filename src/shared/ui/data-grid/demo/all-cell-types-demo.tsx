import type { ColumnDef } from "@tanstack/react-table";

import { useMemo, useState } from "react";

import type { FileCellData } from "@/shared/lib/data-grid";
import { useDataGrid } from "@/shared/lib/data-grid";

import { DataGrid } from "../data-grid";
import { DataGridToolbar } from "./data-grid-demo";
import { mockFilesUpload } from "./mock-files-upload";

// --- Types ---

interface AllCellTypesRow {
  id: string;
  shortText: string;
  longText: string;
  number: number;
  url: string;
  checkbox: boolean;
  select: string;
  multiSelect: string[];
  date: string;
  files: FileCellData[];
}

// --- Sample data ---

function createAllCellTypesData(): AllCellTypesRow[] {
  return [
    {
      id: "1",
      shortText: "Quick note",
      longText:
        "This is a longer description that spans multiple lines and demonstrates how the long text cell handles overflow with a popover editing experience.",
      number: 42,
      url: "https://example.com",
      checkbox: true,
      select: "active",
      multiSelect: ["frontend", "backend"],
      date: "2026-03-15",
      files: [
        {
          id: "f1",
          name: "report.pdf",
          size: 1048576,
          type: "application/pdf",
        },
      ],
    },
    {
      id: "2",
      shortText: "Meeting notes",
      longText:
        "Brief summary of the quarterly review meeting and action items.",
      number: 99,
      url: "docs.example.com/guide",
      checkbox: false,
      select: "draft",
      multiSelect: ["design", "frontend", "mobile"],
      date: "2026-01-20",
      files: [
        { id: "f2", name: "screenshot.png", size: 204800, type: "image/png" },
        {
          id: "f3",
          name: "data.xlsx",
          size: 51200,
          type: "application/vnd.ms-excel",
        },
      ],
    },
    {
      id: "3",
      shortText: "Release checklist",
      longText: "Final verification steps before v2.0 release.",
      number: 7,
      url: "https://github.com/org/repo",
      checkbox: true,
      select: "archived",
      multiSelect: ["ops"],
      date: "2026-06-01",
      files: [],
    },
    {
      id: "4",
      shortText: "Bug report",
      longText:
        "Users report intermittent 500 errors when submitting the contact form during peak hours.",
      number: 0,
      url: "",
      checkbox: false,
      select: "active",
      multiSelect: ["backend", "ops"],
      date: "2026-02-28",
      files: [
        {
          id: "f4",
          name: "presentation.pptx",
          size: 5242880,
          type: "application/vnd.ms-powerpoint",
        },
      ],
    },
    {
      id: "5",
      shortText: "Design review",
      longText: "Review the new dashboard layout with the team.",
      number: 256,
      url: "figma.com/file/abc123",
      checkbox: false,
      select: "draft",
      multiSelect: ["design"],
      date: "2026-04-10",
      files: [
        {
          id: "f5",
          name: "archive.zip",
          size: 10485760,
          type: "application/zip",
        },
        { id: "f6", name: "video.mp4", size: 52428800, type: "video/mp4" },
        { id: "f7", name: "audio.mp3", size: 3145728, type: "audio/mpeg" },
      ],
    },
  ];
}

// --- Options ---

const allCellTypesSelectOptions = [
  { label: "Active", value: "active" },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
];

const allCellTypesTagOptions = [
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "Design", value: "design" },
  { label: "Mobile", value: "mobile" },
  { label: "Ops", value: "ops" },
];

// --- Demo component ---

/** Grid showcasing all 9 cell type variants. */
export function AllCellTypesDemo({ readOnly = false }: { readOnly?: boolean }) {
  const [data, setData] = useState(createAllCellTypesData);

  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable column definitions
  const columns = useMemo<ColumnDef<AllCellTypesRow>[]>(
    () => [
      {
        id: "shortText",
        accessorKey: "shortText",
        header: "Short Text",
        meta: { label: "Short Text", cell: { variant: "short-text" as const } },
        minSize: 140,
      },
      {
        id: "longText",
        accessorKey: "longText",
        header: "Long Text",
        meta: { label: "Long Text", cell: { variant: "long-text" as const } },
        minSize: 200,
      },
      {
        id: "number",
        accessorKey: "number",
        header: "Number",
        meta: {
          label: "Number",
          cell: { variant: "number" as const, min: 0, max: 1000 },
        },
        minSize: 100,
      },
      {
        id: "url",
        accessorKey: "url",
        header: "URL",
        meta: { label: "URL", cell: { variant: "url" as const } },
        minSize: 180,
      },
      {
        id: "checkbox",
        accessorKey: "checkbox",
        header: "Done",
        meta: { label: "Done", cell: { variant: "checkbox" as const } },
        minSize: 80,
      },
      {
        id: "select",
        accessorKey: "select",
        header: "Status",
        meta: {
          label: "Status",
          cell: {
            variant: "select" as const,
            options: allCellTypesSelectOptions,
          },
        },
        minSize: 120,
      },
      {
        id: "multiSelect",
        accessorKey: "multiSelect",
        header: "Tags",
        meta: {
          label: "Tags",
          cell: {
            variant: "multi-select" as const,
            options: allCellTypesTagOptions,
          },
        },
        minSize: 180,
      },
      {
        id: "date",
        accessorKey: "date",
        header: "Due Date",
        meta: { label: "Due Date", cell: { variant: "date" as const } },
        minSize: 130,
      },
      {
        id: "files",
        accessorKey: "files",
        header: "Attachments",
        meta: {
          label: "Attachments",
          cell: { variant: "file" as const, maxFiles: 5, multiple: true },
        },
        minSize: 200,
      },
    ],
    []
  );

  const { table, ...dataGridProps } = useDataGrid({
    columns,
    data,
    onDataChange: setData,
    onFilesUpload: mockFilesUpload,
    getRowId: (row) => row.id,
    enableSearch: true,
    enablePaste: !readOnly,
    readOnly,
  });

  return (
    <div className="w-full max-w-6xl space-y-2">
      <DataGridToolbar table={table} enableView />
      <DataGrid {...dataGridProps} table={table} height={400} />
    </div>
  );
}
