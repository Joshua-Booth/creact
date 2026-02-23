import type { ColumnDef } from "@tanstack/react-table";

import { useMemo, useState } from "react";

import { useDataGrid } from "@/shared/lib/data-grid";

import { DataGrid } from "../data-grid";
import { DataGridKeyboardShortcuts } from "../data-grid-keyboard-shortcuts";
import { DataGridToolbar } from "./data-grid-demo";

// --- Types ---

interface Employee {
  id: string;
  fullName: string;
  email: string;
  department: string;
  role: string;
  skills: string[];
  startDate: string;
  active: boolean;
}

// --- Sample data ---

function createEmployeeData(): Employee[] {
  return [
    {
      id: "1",
      fullName: "Amara Okafor",
      email: "amara.okafor@acme.com",
      department: "Engineering",
      role: "Staff Engineer",
      skills: ["TypeScript", "Rust", "System Design"],
      startDate: "2019-03-15",
      active: true,
    },
    {
      id: "2",
      fullName: "Liam Chen",
      email: "liam.chen@acme.com",
      department: "Design",
      role: "Senior Designer",
      skills: ["Figma", "CSS", "Prototyping"],
      startDate: "2020-07-01",
      active: true,
    },
    {
      id: "3",
      fullName: "Sofia Martinez",
      email: "sofia.martinez@acme.com",
      department: "Product",
      role: "Product Manager",
      skills: ["SQL", "Analytics", "Roadmapping"],
      startDate: "2021-01-10",
      active: true,
    },
    {
      id: "4",
      fullName: "Raj Patel",
      email: "raj.patel@acme.com",
      department: "Engineering",
      role: "Backend Engineer",
      skills: ["Python", "Go", "PostgreSQL"],
      startDate: "2022-06-20",
      active: true,
    },
    {
      id: "5",
      fullName: "Emma Johansson",
      email: "emma.johansson@acme.com",
      department: "Marketing",
      role: "Growth Lead",
      skills: ["Analytics", "SEO", "Copywriting"],
      startDate: "2020-11-05",
      active: true,
    },
    {
      id: "6",
      fullName: "Kenji Tanaka",
      email: "kenji.tanaka@acme.com",
      department: "Engineering",
      role: "Frontend Engineer",
      skills: ["TypeScript", "React", "CSS"],
      startDate: "2023-02-14",
      active: true,
    },
    {
      id: "7",
      fullName: "Fatima Al-Rashid",
      email: "fatima.alrashid@acme.com",
      department: "Data Science",
      role: "ML Engineer",
      skills: ["Python", "TensorFlow", "SQL"],
      startDate: "2021-09-01",
      active: true,
    },
    {
      id: "8",
      fullName: "Marcus Johnson",
      email: "marcus.johnson@acme.com",
      department: "Sales",
      role: "Account Executive",
      skills: ["Negotiation", "CRM", "Presentations"],
      startDate: "2022-04-18",
      active: false,
    },
    {
      id: "9",
      fullName: "Yuki Sato",
      email: "yuki.sato@acme.com",
      department: "QA",
      role: "QA Lead",
      skills: ["Playwright", "TypeScript", "CI/CD"],
      startDate: "2020-01-20",
      active: true,
    },
    {
      id: "10",
      fullName: "Priya Sharma",
      email: "priya.sharma@acme.com",
      department: "Engineering",
      role: "DevOps Engineer",
      skills: ["Kubernetes", "Terraform", "Go"],
      startDate: "2021-05-12",
      active: true,
    },
    {
      id: "11",
      fullName: "Oliver Eriksen",
      email: "oliver.eriksen@acme.com",
      department: "Finance",
      role: "Financial Analyst",
      skills: ["Excel", "SQL", "Forecasting"],
      startDate: "2023-08-01",
      active: true,
    },
    {
      id: "12",
      fullName: "Nia Williams",
      email: "nia.williams@acme.com",
      department: "HR",
      role: "People Partner",
      skills: ["Recruiting", "Coaching", "Analytics"],
      startDate: "2019-10-28",
      active: true,
    },
  ];
}

// --- Options ---

const departmentOptions = [
  { label: "Engineering", value: "Engineering" },
  { label: "Design", value: "Design" },
  { label: "Product", value: "Product" },
  { label: "Marketing", value: "Marketing" },
  { label: "Data Science", value: "Data Science" },
  { label: "Sales", value: "Sales" },
  { label: "QA", value: "QA" },
  { label: "Finance", value: "Finance" },
  { label: "HR", value: "HR" },
];

const skillOptions = [
  { label: "TypeScript", value: "TypeScript" },
  { label: "Python", value: "Python" },
  { label: "Go", value: "Go" },
  { label: "Rust", value: "Rust" },
  { label: "React", value: "React" },
  { label: "Figma", value: "Figma" },
  { label: "CSS", value: "CSS" },
  { label: "SQL", value: "SQL" },
  { label: "Kubernetes", value: "Kubernetes" },
  { label: "Terraform", value: "Terraform" },
  { label: "Analytics", value: "Analytics" },
  { label: "Playwright", value: "Playwright" },
];

// --- Demo component ---

/** Read-only company directory with search for employee lookup. */
export function EmployeeDirectoryDemo({
  readOnly = true,
}: {
  readOnly?: boolean;
}) {
  const [data, setData] = useState(createEmployeeData);

  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable column definitions
  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        id: "fullName",
        accessorKey: "fullName",
        header: "Full Name",
        meta: {
          label: "Full Name",
          cell: { variant: "short-text" as const },
        },
        minSize: 170,
      },
      {
        id: "email",
        accessorKey: "email",
        header: "Email",
        meta: { label: "Email", cell: { variant: "url" as const } },
        minSize: 220,
      },
      {
        id: "department",
        accessorKey: "department",
        header: "Department",
        meta: {
          label: "Department",
          cell: {
            variant: "select" as const,
            options: departmentOptions,
          },
        },
        minSize: 140,
      },
      {
        id: "role",
        accessorKey: "role",
        header: "Role",
        meta: { label: "Role", cell: { variant: "short-text" as const } },
        minSize: 160,
      },
      {
        id: "skills",
        accessorKey: "skills",
        header: "Skills",
        meta: {
          label: "Skills",
          cell: {
            variant: "multi-select" as const,
            options: skillOptions,
          },
        },
        minSize: 220,
      },
      {
        id: "startDate",
        accessorKey: "startDate",
        header: "Start Date",
        meta: {
          label: "Start Date",
          cell: { variant: "date" as const },
        },
        minSize: 130,
      },
      {
        id: "active",
        accessorKey: "active",
        header: "Active",
        meta: { label: "Active", cell: { variant: "checkbox" as const } },
        minSize: 80,
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
    rowHeight: "short",
    initialState: {
      columnPinning: { left: ["fullName"] },
    },
    readOnly,
  });

  return (
    <div className="w-full max-w-6xl space-y-2">
      <DataGridToolbar table={table} enableSort enableFilter enableView />
      <DataGridKeyboardShortcuts enableSearch={!!dataGridProps.searchState} />
      <DataGrid {...dataGridProps} table={table} height={380} />
    </div>
  );
}
