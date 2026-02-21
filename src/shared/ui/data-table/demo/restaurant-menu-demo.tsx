import type { ColumnDef } from "@tanstack/react-table";

import { useMemo } from "react";

import { Text } from "lucide-react";

import { useDataTable } from "@/shared/lib/data-table";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";

import { DataTable } from "../data-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTableToolbar } from "../data-table-toolbar";

// --- Types ---

interface MenuItem {
  id: string;
  name: string;
  description: string;
  course: string;
  price: number;
  calories: number;
  allergens: string[];
  vegetarian: boolean;
}

// --- Sample data ---

function createMenuData(): MenuItem[] {
  return [
    {
      id: "1",
      name: "Bruschetta",
      description:
        "Grilled bread rubbed with garlic, topped with diced tomatoes, basil, and olive oil",
      course: "Appetizer",
      price: 9.5,
      calories: 220,
      allergens: ["Gluten"],
      vegetarian: true,
    },
    {
      id: "2",
      name: "Caesar Salad",
      description:
        "Romaine lettuce, parmesan, croutons, and house-made Caesar dressing",
      course: "Appetizer",
      price: 12.0,
      calories: 340,
      allergens: ["Gluten", "Dairy", "Eggs"],
      vegetarian: true,
    },
    {
      id: "3",
      name: "French Onion Soup",
      description:
        "Slow-caramelized onion broth topped with a crusty baguette and melted Gruyere",
      course: "Appetizer",
      price: 11.0,
      calories: 420,
      allergens: ["Gluten", "Dairy"],
      vegetarian: true,
    },
    {
      id: "4",
      name: "Grilled Salmon",
      description:
        "Atlantic salmon fillet with lemon-dill butter, served with seasonal vegetables",
      course: "Main",
      price: 28.0,
      calories: 520,
      allergens: ["Fish"],
      vegetarian: false,
    },
    {
      id: "5",
      name: "Mushroom Risotto",
      description:
        "Arborio rice with porcini and cremini mushrooms, finished with truffle oil and parmesan",
      course: "Main",
      price: 22.0,
      calories: 680,
      allergens: ["Dairy"],
      vegetarian: true,
    },
    {
      id: "6",
      name: "Filet Mignon",
      description:
        "8oz center-cut beef tenderloin with red wine reduction and roasted garlic mash",
      course: "Main",
      price: 42.0,
      calories: 750,
      allergens: ["Dairy"],
      vegetarian: false,
    },
    {
      id: "7",
      name: "Pad See Ew",
      description:
        "Wide rice noodles stir-fried with Chinese broccoli, egg, and sweet soy sauce",
      course: "Main",
      price: 18.0,
      calories: 590,
      allergens: ["Gluten", "Soy", "Eggs"],
      vegetarian: false,
    },
    {
      id: "8",
      name: "Truffle Fries",
      description:
        "Hand-cut fries tossed with truffle oil, parmesan, and fresh parsley",
      course: "Side",
      price: 10.0,
      calories: 450,
      allergens: ["Dairy"],
      vegetarian: true,
    },
    {
      id: "9",
      name: "Roasted Brussels Sprouts",
      description:
        "Crispy sprouts with balsamic glaze, toasted hazelnuts, and dried cranberries",
      course: "Side",
      price: 9.0,
      calories: 180,
      allergens: ["Nuts"],
      vegetarian: true,
    },
    {
      id: "10",
      name: "Garlic Bread",
      description: "Toasted ciabatta with roasted garlic butter and herbs",
      course: "Side",
      price: 7.0,
      calories: 290,
      allergens: ["Gluten", "Dairy"],
      vegetarian: true,
    },
    {
      id: "11",
      name: "Tiramisu",
      description:
        "Classic Italian dessert with espresso-soaked ladyfingers, mascarpone cream, and cocoa",
      course: "Dessert",
      price: 12.0,
      calories: 480,
      allergens: ["Gluten", "Dairy", "Eggs"],
      vegetarian: true,
    },
    {
      id: "12",
      name: "Chocolate Lava Cake",
      description:
        "Warm dark chocolate cake with a molten center, served with vanilla bean ice cream",
      course: "Dessert",
      price: 14.0,
      calories: 620,
      allergens: ["Gluten", "Dairy", "Eggs"],
      vegetarian: true,
    },
    {
      id: "13",
      name: "Espresso",
      description: "Double shot of house-roasted single-origin espresso",
      course: "Beverage",
      price: 4.0,
      calories: 5,
      allergens: [],
      vegetarian: true,
    },
    {
      id: "14",
      name: "Sparkling Lemonade",
      description:
        "Fresh-squeezed lemon juice with sparkling water and elderflower syrup",
      course: "Beverage",
      price: 6.0,
      calories: 120,
      allergens: [],
      vegetarian: true,
    },
  ];
}

// --- Options ---

const courseOptions = [
  { label: "Appetizer", value: "Appetizer" },
  { label: "Main", value: "Main" },
  { label: "Side", value: "Side" },
  { label: "Dessert", value: "Dessert" },
  { label: "Beverage", value: "Beverage" },
];

const allergenOptions = [
  { label: "Gluten", value: "Gluten" },
  { label: "Dairy", value: "Dairy" },
  { label: "Nuts", value: "Nuts" },
  { label: "Eggs", value: "Eggs" },
  { label: "Fish", value: "Fish" },
  { label: "Soy", value: "Soy" },
  { label: "Shellfish", value: "Shellfish" },
];

// --- Helpers ---

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

// --- Demo ---

/** Restaurant menu table without row selection, with allergen badges and boolean filters. */
export function RestaurantMenuDemo() {
  const data = useMemo(() => createMenuData(), []);

  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable reference for table config
  const columns = useMemo<ColumnDef<MenuItem>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Item" />
        ),
        cell: ({ cell }) => (
          <div className="font-medium">{cell.getValue<string>()}</div>
        ),
        meta: {
          label: "Item",
          placeholder: "Search menu...",
          variant: "text",
          icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: "description",
        accessorKey: "description",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Description" />
        ),
        cell: ({ cell }) => (
          <div className="text-muted-foreground max-w-[300px] truncate italic">
            {cell.getValue<string>()}
          </div>
        ),
      },
      {
        id: "course",
        accessorKey: "course",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Course" />
        ),
        cell: ({ cell }) => {
          const course = cell.getValue<string>();
          const dotColors: Record<string, string> = {
            Appetizer: "bg-emerald-500",
            Main: "bg-blue-500",
            Side: "bg-amber-500",
            Dessert: "bg-pink-500",
            Beverage: "bg-slate-500",
          };
          const dotColor = dotColors[course] ?? "bg-gray-500";
          return (
            <Badge variant="outline">
              <span className={cn("size-2 shrink-0 rounded-full", dotColor)} />
              {course}
            </Badge>
          );
        },
        meta: {
          label: "Course",
          variant: "select",
          options: courseOptions,
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
            {formatPrice(cell.getValue<number>())}
          </div>
        ),
        size: 100,
        meta: {
          label: "Price",
          placeholder: "Price",
          variant: "number",
          unit: "$",
        },
        enableColumnFilter: true,
      },
      {
        id: "calories",
        accessorKey: "calories",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Calories" />
        ),
        cell: ({ cell }) => (
          <div className="text-right tabular-nums">
            {cell.getValue<number>()} cal
          </div>
        ),
        meta: {
          label: "Calories",
          variant: "range",
          range: [0, 1200] as [number, number],
          unit: "cal",
        },
        enableColumnFilter: true,
      },
      {
        id: "allergens",
        accessorKey: "allergens",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Allergens" />
        ),
        cell: ({ cell }) => {
          const items = cell.getValue<string[]>();
          if (items.length === 0)
            return <span className="text-muted-foreground">None</span>;
          return (
            <div className="flex flex-wrap gap-1">
              {items.map((a) => (
                <Badge key={a} variant="destructive" className="text-xs">
                  {a}
                </Badge>
              ))}
            </div>
          );
        },
        meta: {
          label: "Allergens",
          variant: "multiSelect",
          options: allergenOptions,
        },
        enableColumnFilter: true,
      },
      {
        id: "vegetarian",
        accessorKey: "vegetarian",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Vegetarian" />
        ),
        cell: ({ cell }) => (
          <div>{cell.getValue<boolean>() ? "🌱 Yes" : "No"}</div>
        ),
        meta: {
          label: "Vegetarian",
          variant: "boolean",
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
      sorting: [{ id: "course", desc: false }],
    },
  });

  return (
    <div className="w-full max-w-5xl">
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}
