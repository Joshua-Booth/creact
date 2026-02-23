import type { ColumnDef } from "@tanstack/react-table";

import { useMemo } from "react";

import {
  BedDouble,
  Building2,
  CalendarIcon,
  Castle,
  CheckCircle2,
  CircleDashed,
  Clock,
  Home,
  Landmark,
  Text,
  XCircle,
} from "lucide-react";

import { useDataTable } from "@/shared/lib/data-table";
import { Badge } from "@/shared/ui/badge";
import { Checkbox } from "@/shared/ui/checkbox";

import { DataTable } from "../data-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTableToolbar } from "../data-table-toolbar";

// --- Types ---

interface Listing {
  id: string;
  address: string;
  city: string;
  price: number;
  sqft: number;
  bedrooms: number;
  yearBuilt: number;
  hasPool: boolean;
  type: string;
  status: string;
  listedDate: number;
}

// --- Sample data ---

function createListingData(): Listing[] {
  return [
    {
      id: "1",
      address: "742 Evergreen Terrace",
      city: "Springfield",
      price: 295000,
      sqft: 1800,
      bedrooms: 3,
      yearBuilt: 1985,
      hasPool: false,
      type: "Single Family",
      status: "Active",
      listedDate: new Date(2025, 11, 1).getTime(),
    },
    {
      id: "2",
      address: "1600 Pennsylvania Ave",
      city: "Washington",
      price: 1250000,
      sqft: 4200,
      bedrooms: 5,
      yearBuilt: 1800,
      hasPool: true,
      type: "Single Family",
      status: "Active",
      listedDate: new Date(2025, 10, 15).getTime(),
    },
    {
      id: "3",
      address: "221B Baker Street",
      city: "London",
      price: 875000,
      sqft: 2400,
      bedrooms: 2,
      yearBuilt: 1890,
      hasPool: false,
      type: "Townhouse",
      status: "Pending",
      listedDate: new Date(2025, 9, 20).getTime(),
    },
    {
      id: "4",
      address: "350 Fifth Avenue",
      city: "New York",
      price: 520000,
      sqft: 950,
      bedrooms: 1,
      yearBuilt: 2018,
      hasPool: false,
      type: "Condo",
      status: "Active",
      listedDate: new Date(2026, 0, 5).getTime(),
    },
    {
      id: "5",
      address: "12 Grimmauld Place",
      city: "London",
      price: 425000,
      sqft: 3100,
      bedrooms: 4,
      yearBuilt: 1870,
      hasPool: false,
      type: "Townhouse",
      status: "Sold",
      listedDate: new Date(2025, 7, 10).getTime(),
    },
    {
      id: "6",
      address: "4 Privet Drive",
      city: "Surrey",
      price: 310000,
      sqft: 1650,
      bedrooms: 3,
      yearBuilt: 1972,
      hasPool: false,
      type: "Single Family",
      status: "Active",
      listedDate: new Date(2025, 11, 20).getTime(),
    },
    {
      id: "7",
      address: "1007 Mountain Drive",
      city: "Gotham",
      price: 985000,
      sqft: 5500,
      bedrooms: 6,
      yearBuilt: 1940,
      hasPool: true,
      type: "Estate",
      status: "Active",
      listedDate: new Date(2026, 0, 12).getTime(),
    },
    {
      id: "8",
      address: "42 Wallaby Way",
      city: "Sydney",
      price: 185000,
      sqft: 1200,
      bedrooms: 2,
      yearBuilt: 2005,
      hasPool: true,
      type: "Condo",
      status: "Pending",
      listedDate: new Date(2025, 10, 28).getTime(),
    },
    {
      id: "9",
      address: "90210 Sunset Blvd",
      city: "Beverly Hills",
      price: 1100000,
      sqft: 3800,
      bedrooms: 4,
      yearBuilt: 1995,
      hasPool: true,
      type: "Single Family",
      status: "Active",
      listedDate: new Date(2026, 1, 1).getTime(),
    },
    {
      id: "10",
      address: "31 Spooner Street",
      city: "Quahog",
      price: 245000,
      sqft: 1400,
      bedrooms: 3,
      yearBuilt: 1990,
      hasPool: false,
      type: "Single Family",
      status: "Sold",
      listedDate: new Date(2025, 6, 15).getTime(),
    },
    {
      id: "11",
      address: "124 Conch Street",
      city: "Bikini Bottom",
      price: 199000,
      sqft: 800,
      bedrooms: 1,
      yearBuilt: 2010,
      hasPool: false,
      type: "Condo",
      status: "Active",
      listedDate: new Date(2026, 1, 10).getTime(),
    },
    {
      id: "12",
      address: "1725 Slough Avenue",
      city: "Scranton",
      price: 275000,
      sqft: 2100,
      bedrooms: 3,
      yearBuilt: 1978,
      hasPool: false,
      type: "Single Family",
      status: "Pending",
      listedDate: new Date(2025, 8, 5).getTime(),
    },
  ];
}

// --- Options ---

const listingTypeOptions = [
  { label: "Single Family", value: "Single Family" },
  { label: "Condo", value: "Condo" },
  { label: "Townhouse", value: "Townhouse" },
  { label: "Estate", value: "Estate" },
];

const listingStatusOptions = [
  { label: "Active", value: "Active", icon: CheckCircle2 },
  { label: "Pending", value: "Pending", icon: Clock },
  { label: "Sold", value: "Sold", icon: XCircle },
];

// --- Helpers ---

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

// --- Demo ---

/** Real estate listings table with boolean, range, date, and multi-select filters. */
export function RealEstateListingsDemo() {
  const data = useMemo(() => createListingData(), []);

  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable reference for table config
  const columns = useMemo<ColumnDef<Listing>[]>(
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
        id: "address",
        accessorKey: "address",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Address" />
        ),
        cell: ({ cell }) => (
          <div className="font-medium">{cell.getValue<string>()}</div>
        ),
        meta: {
          label: "Address",
          placeholder: "Search addresses...",
          variant: "text",
          icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: "city",
        accessorKey: "city",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="City" />
        ),
        cell: ({ cell }) => cell.getValue<string>(),
        meta: {
          label: "City",
          variant: "select",
          options: [
            { label: "Springfield", value: "Springfield" },
            { label: "Washington", value: "Washington" },
            { label: "London", value: "London" },
            { label: "New York", value: "New York" },
            { label: "Surrey", value: "Surrey" },
            { label: "Gotham", value: "Gotham" },
            { label: "Sydney", value: "Sydney" },
            { label: "Beverly Hills", value: "Beverly Hills" },
            { label: "Quahog", value: "Quahog" },
            { label: "Bikini Bottom", value: "Bikini Bottom" },
            { label: "Scranton", value: "Scranton" },
          ],
        },
        enableColumnFilter: true,
      },
      {
        id: "price",
        accessorKey: "price",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Price" />
        ),
        cell: ({ cell }) => (
          <div className="text-right font-medium tabular-nums">
            {formatCurrency(cell.getValue<number>())}
          </div>
        ),
        size: 150,
        meta: {
          label: "Price",
          variant: "range",
          range: [100_000, 1_500_000] as [number, number],
          unit: "$",
          unitPlacement: "prefix",
        },
        enableColumnFilter: true,
      },
      {
        id: "sqft",
        accessorKey: "sqft",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Sq Ft" />
        ),
        cell: ({ cell }) => (
          <div className="text-right tabular-nums">
            {cell.getValue<number>().toLocaleString()}
          </div>
        ),
        size: 100,
        meta: {
          label: "Sq Ft",
          placeholder: "Sq ft",
          variant: "number",
        },
        enableColumnFilter: true,
      },
      {
        id: "listedDate",
        accessorKey: "listedDate",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Listed" />
        ),
        cell: ({ cell }) => (
          <div>
            {new Date(cell.getValue<number>()).toLocaleDateString("en-US")}
          </div>
        ),
        meta: {
          label: "Listed",
          variant: "date",
          icon: CalendarIcon,
        },
        enableColumnFilter: true,
      },
      {
        id: "hasPool",
        accessorKey: "hasPool",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Pool" />
        ),
        cell: ({ cell }) => (
          <div>{cell.getValue<boolean>() ? "Yes" : "No"}</div>
        ),
        meta: {
          label: "Pool",
          variant: "boolean",
        },
        enableColumnFilter: true,
      },
      {
        id: "bedrooms",
        accessorKey: "bedrooms",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Beds" />
        ),
        cell: ({ cell }) => (
          <div className="flex items-center gap-1.5">
            <BedDouble className="text-muted-foreground size-3.5" />
            {cell.getValue<number>()}
          </div>
        ),
      },
      {
        id: "type",
        accessorKey: "type",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Type" />
        ),
        cell: ({ cell }) => {
          const type = cell.getValue<string>();
          const icons: Record<string, typeof Home> = {
            "Single Family": Home,
            Condo: Building2,
            Townhouse: Landmark,
            Estate: Castle,
          };
          const Icon = icons[type] ?? Home;
          return (
            <Badge variant="outline">
              <Icon className="size-3.5" />
              {type}
            </Badge>
          );
        },
        meta: {
          label: "Type",
          variant: "multiSelect",
          options: listingTypeOptions,
        },
        enableColumnFilter: true,
      },
      {
        id: "status",
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Status" />
        ),
        cell: ({ cell }) => {
          const status = cell.getValue<string>();
          const opt = listingStatusOptions.find((o) => o.value === status);
          const Icon = opt?.icon ?? CircleDashed;
          return (
            <Badge variant="outline">
              <Icon className="size-3.5" />
              {status}
            </Badge>
          );
        },
        meta: {
          label: "Status",
          variant: "multiSelect",
          options: listingStatusOptions,
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
      sorting: [{ id: "price", desc: true }],
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
