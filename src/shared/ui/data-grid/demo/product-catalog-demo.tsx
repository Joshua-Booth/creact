import type { ColumnDef } from "@tanstack/react-table";

import { useMemo, useState } from "react";

import type { FileCellData } from "@/shared/lib/data-grid";
import { useDataGrid } from "@/shared/lib/data-grid";

import { DataGrid } from "../data-grid";
import { DataGridToolbar } from "./data-grid-demo";
import { mockFilesUpload } from "./mock-files-upload";

// --- Types ---

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  category: string;
  tags: string[];
  productUrl: string;
  inStock: boolean;
  images: FileCellData[];
}

// --- Sample data ---

function createProductData(): Product[] {
  return [
    {
      id: "1",
      name: "Wireless Headphones",
      description:
        "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and multipoint Bluetooth connectivity. Memory foam ear cushions for all-day comfort.",
      price: 249.99,
      sku: "AUDIO-WH-001",
      category: "Electronics",
      tags: ["Best Seller", "New Arrival"],
      productUrl: "https://shop.example.com/headphones",
      inStock: true,
      images: [
        {
          id: "p1",
          name: "headphones-black.jpg",
          size: 350000,
          type: "image/jpeg",
        },
      ],
    },
    {
      id: "2",
      name: "Organic Cotton T-Shirt",
      description:
        "Heavyweight 220gsm organic cotton tee with a relaxed fit. Pre-shrunk and garment-dyed for a vintage feel.",
      price: 38.0,
      sku: "APP-TS-042",
      category: "Apparel",
      tags: ["Eco-Friendly"],
      productUrl: "https://shop.example.com/cotton-tee",
      inStock: true,
      images: [],
    },
    {
      id: "3",
      name: "Cast Iron Dutch Oven",
      description:
        "5.5-quart enameled cast iron dutch oven. Even heat distribution and superior heat retention for braising, baking, and slow-cooking.",
      price: 89.95,
      sku: "KITCHEN-DO-007",
      category: "Kitchen",
      tags: ["Best Seller"],
      productUrl: "https://shop.example.com/dutch-oven",
      inStock: true,
      images: [
        {
          id: "p2",
          name: "dutch-oven.jpg",
          size: 280000,
          type: "image/jpeg",
        },
      ],
    },
    {
      id: "4",
      name: "Yoga Mat",
      description:
        "6mm thick non-slip yoga mat made from natural tree rubber. Antimicrobial surface with alignment markings.",
      price: 68.0,
      sku: "FIT-YM-015",
      category: "Fitness",
      tags: ["Eco-Friendly", "New Arrival"],
      productUrl: "https://shop.example.com/yoga-mat",
      inStock: true,
      images: [],
    },
    {
      id: "5",
      name: "Mechanical Keyboard",
      description:
        "65% layout with hot-swappable switches, PBT keycaps, and per-key RGB. USB-C and Bluetooth 5.0 connectivity.",
      price: 159.0,
      sku: "TECH-KB-023",
      category: "Electronics",
      tags: ["Sale"],
      productUrl: "https://shop.example.com/keyboard",
      inStock: false,
      images: [
        { id: "p3", name: "keyboard.png", size: 420000, type: "image/png" },
        {
          id: "p4",
          name: "keyboard-side.png",
          size: 310000,
          type: "image/png",
        },
      ],
    },
    {
      id: "6",
      name: "Ceramic Planter Set",
      description:
        "Set of 3 minimalist ceramic planters in matte white. Includes drainage holes and bamboo saucers. Sizes: 4, 6, and 8 inches.",
      price: 42.5,
      sku: "HOME-PL-088",
      category: "Home",
      tags: [],
      productUrl: "",
      inStock: true,
      images: [],
    },
    {
      id: "7",
      name: "Running Shoes",
      description:
        "Lightweight neutral running shoe with responsive foam midsole. Engineered mesh upper for breathability. 8mm heel-to-toe drop.",
      price: 134.99,
      sku: "FIT-RS-061",
      category: "Fitness",
      tags: ["New Arrival"],
      productUrl: "https://shop.example.com/running-shoes",
      inStock: true,
      images: [
        { id: "p5", name: "shoes.jpg", size: 380000, type: "image/jpeg" },
      ],
    },
    {
      id: "8",
      name: "Espresso Machine",
      description:
        "Semi-automatic espresso machine with 15-bar pressure pump, PID temperature control, and built-in grinder. 2L removable water tank.",
      price: 599.0,
      sku: "KITCHEN-EM-003",
      category: "Kitchen",
      tags: ["Best Seller", "Sale"],
      productUrl: "https://shop.example.com/espresso",
      inStock: true,
      images: [],
    },
    {
      id: "9",
      name: "Leather Journal",
      description:
        "Hand-stitched full-grain leather journal with 240 pages of 100gsm acid-free paper. Lay-flat binding and ribbon bookmark.",
      price: 45.0,
      sku: "STAT-LJ-012",
      category: "Stationery",
      tags: [],
      productUrl: "https://shop.example.com/journal",
      inStock: true,
      images: [],
    },
    {
      id: "10",
      name: "Portable Bluetooth Speaker",
      description:
        "Waterproof IP67 portable speaker with 360-degree sound. 20-hour battery life and built-in power bank feature.",
      price: 79.99,
      sku: "AUDIO-BS-009",
      category: "Electronics",
      tags: ["Sale", "Best Seller"],
      productUrl: "https://shop.example.com/speaker",
      inStock: false,
      images: [
        { id: "p6", name: "speaker.jpg", size: 190000, type: "image/jpeg" },
      ],
    },
  ];
}

// --- Options ---

const categoryOptions = [
  { label: "Electronics", value: "Electronics" },
  { label: "Apparel", value: "Apparel" },
  { label: "Kitchen", value: "Kitchen" },
  { label: "Fitness", value: "Fitness" },
  { label: "Home", value: "Home" },
  { label: "Stationery", value: "Stationery" },
  { label: "Outdoor", value: "Outdoor" },
];

const productTagOptions = [
  { label: "New Arrival", value: "New Arrival" },
  { label: "Sale", value: "Sale" },
  { label: "Best Seller", value: "Best Seller" },
  { label: "Eco-Friendly", value: "Eco-Friendly" },
  { label: "Limited Edition", value: "Limited Edition" },
  { label: "Clearance", value: "Clearance" },
];

// --- Demo component ---

/** E-commerce product catalog with all cell variants, paste, and search. */
export function ProductCatalogDemo({
  readOnly = false,
}: {
  readOnly?: boolean;
}) {
  const [data, setData] = useState(createProductData);

  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable column definitions
  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Product",
        meta: { label: "Product", cell: { variant: "short-text" as const } },
        minSize: 180,
      },
      {
        id: "description",
        accessorKey: "description",
        header: "Description",
        meta: {
          label: "Description",
          cell: { variant: "long-text" as const },
        },
        minSize: 200,
      },
      {
        id: "price",
        accessorKey: "price",
        header: "Price",
        meta: {
          label: "Price",
          cell: {
            variant: "number" as const,
            min: 0,
            step: 0.01,
          },
        },
        minSize: 100,
      },
      {
        id: "sku",
        accessorKey: "sku",
        header: "SKU",
        meta: { label: "SKU", cell: { variant: "short-text" as const } },
        minSize: 140,
      },
      {
        id: "category",
        accessorKey: "category",
        header: "Category",
        meta: {
          label: "Category",
          cell: { variant: "select" as const, options: categoryOptions },
        },
        minSize: 130,
      },
      {
        id: "tags",
        accessorKey: "tags",
        header: "Tags",
        meta: {
          label: "Tags",
          cell: {
            variant: "multi-select" as const,
            options: productTagOptions,
          },
        },
        minSize: 200,
      },
      {
        id: "productUrl",
        accessorKey: "productUrl",
        header: "URL",
        meta: { label: "URL", cell: { variant: "url" as const } },
        minSize: 220,
      },
      {
        id: "inStock",
        accessorKey: "inStock",
        header: "In Stock",
        meta: {
          label: "In Stock",
          cell: { variant: "checkbox" as const },
        },
        minSize: 90,
      },
      {
        id: "images",
        accessorKey: "images",
        header: "Images",
        meta: {
          label: "Images",
          cell: {
            variant: "file" as const,
            accept: "image/*",
            multiple: true,
            maxFiles: 5,
          },
        },
        minSize: 200,
      },
    ],
    []
  );

  const onRowAdd = readOnly
    ? undefined
    : () => {
        const newRow: Product = {
          id: String(Date.now()),
          name: "",
          description: "",
          price: 0,
          sku: "",
          category: "",
          tags: [],
          productUrl: "",
          inStock: true,
          images: [],
        };
        setData((prev) => [...prev, newRow]);
        return null;
      };

  const { table, ...dataGridProps } = useDataGrid({
    columns,
    data,
    onDataChange: setData,
    onRowAdd,
    onFilesUpload: mockFilesUpload,
    getRowId: (row) => row.id,
    enableSearch: true,
    enablePaste: !readOnly,
    rowHeight: "extra-tall",
    initialState: {
      columnPinning: { left: ["name"] },
    },
    readOnly,
  });

  return (
    <div className="w-full max-w-7xl space-y-2">
      <DataGridToolbar
        table={table}
        enableSort
        enableFilter
        enableRowHeight
        enableView
      />
      <DataGrid {...dataGridProps} table={table} height={450} />
    </div>
  );
}
