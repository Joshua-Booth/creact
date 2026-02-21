import type { ColumnDef } from "@tanstack/react-table";

import { useMemo, useState } from "react";

import type { FileCellData } from "@/shared/lib/data-grid";
import { useDataGrid } from "@/shared/lib/data-grid";

import { DataGrid } from "../data-grid";
import { DataGridToolbar } from "./data-grid-demo";
import { mockFilesUpload } from "./mock-files-upload";

// --- Types ---

interface Recipe {
  id: string;
  name: string;
  instructions: string;
  prepMinutes: number;
  servings: number;
  cuisine: string;
  dietary: string[];
  sourceUrl: string;
  photos: FileCellData[];
}

// --- Sample data ---

function createRecipeData(): Recipe[] {
  return [
    {
      id: "1",
      name: "Pad Thai",
      instructions:
        "Soak rice noodles in warm water for 30 minutes. Stir-fry shrimp and tofu in a hot wok with garlic. Add noodles, tamarind sauce, fish sauce, and sugar. Toss with bean sprouts, crushed peanuts, and a squeeze of lime.",
      prepMinutes: 45,
      servings: 4,
      cuisine: "Thai",
      dietary: ["Gluten-Free"],
      sourceUrl: "https://example.com/pad-thai",
      photos: [
        { id: "r1", name: "pad-thai.jpg", size: 204800, type: "image/jpeg" },
      ],
    },
    {
      id: "2",
      name: "Margherita Pizza",
      instructions:
        "Stretch dough into a 12-inch circle. Spread San Marzano tomato sauce evenly. Top with fresh mozzarella slices and basil leaves. Bake at 500 F on a preheated pizza stone for 8-10 minutes until the crust is golden and cheese is bubbling.",
      prepMinutes: 90,
      servings: 2,
      cuisine: "Italian",
      dietary: ["Vegetarian"],
      sourceUrl: "https://example.com/margherita",
      photos: [],
    },
    {
      id: "3",
      name: "Butter Chicken",
      instructions:
        "Marinate chicken in yogurt, garam masala, and turmeric for at least 2 hours. Grill or broil until charred. Simmer in a sauce of tomatoes, butter, cream, and spices until rich and velvety. Serve with basmati rice or naan.",
      prepMinutes: 180,
      servings: 6,
      cuisine: "Indian",
      dietary: ["Gluten-Free"],
      sourceUrl: "https://example.com/butter-chicken",
      photos: [
        {
          id: "r2",
          name: "butter-chicken.jpg",
          size: 310000,
          type: "image/jpeg",
        },
      ],
    },
    {
      id: "4",
      name: "Black Bean Tacos",
      instructions:
        "Sauté black beans with cumin, chili powder, and lime juice. Warm corn tortillas. Fill with beans, diced avocado, pickled onions, cilantro, and a drizzle of crema.",
      prepMinutes: 25,
      servings: 4,
      cuisine: "Mexican",
      dietary: ["Vegetarian", "Vegan", "Gluten-Free"],
      sourceUrl: "https://example.com/bean-tacos",
      photos: [],
    },
    {
      id: "5",
      name: "Miso Ramen",
      instructions:
        "Prepare dashi stock with kombu and bonito flakes. Whisk in white miso paste. Cook ramen noodles separately. Assemble bowls with broth, noodles, soft-boiled egg, chashu pork, corn, and scallions.",
      prepMinutes: 60,
      servings: 2,
      cuisine: "Japanese",
      dietary: [],
      sourceUrl: "https://example.com/miso-ramen",
      photos: [
        { id: "r3", name: "ramen.png", size: 420000, type: "image/png" },
      ],
    },
    {
      id: "6",
      name: "Greek Salad",
      instructions:
        "Chop cucumbers, tomatoes, red onion, and bell pepper into bite-sized pieces. Add Kalamata olives and a block of feta cheese. Dress with extra virgin olive oil, red wine vinegar, dried oregano, salt, and pepper.",
      prepMinutes: 15,
      servings: 4,
      cuisine: "Greek",
      dietary: ["Vegetarian", "Gluten-Free"],
      sourceUrl: "",
      photos: [],
    },
    {
      id: "7",
      name: "Croissants",
      instructions:
        "Mix flour, sugar, yeast, and salt into a dough. Enclose a cold butter block and perform three double folds with chilling in between. Shape into crescents, proof until doubled, then bake at 400 F until deeply golden and flaky.",
      prepMinutes: 480,
      servings: 12,
      cuisine: "French",
      dietary: ["Vegetarian"],
      sourceUrl: "https://example.com/croissants",
      photos: [
        {
          id: "r4",
          name: "croissants.jpg",
          size: 180000,
          type: "image/jpeg",
        },
      ],
    },
    {
      id: "8",
      name: "Bibimbap",
      instructions:
        "Cook short-grain rice. Prepare individual toppings: sautéed spinach, bean sprouts, carrots, zucchini, and marinated beef. Arrange on rice in a hot stone bowl. Top with a fried egg and gochujang. Mix thoroughly before eating.",
      prepMinutes: 50,
      servings: 2,
      cuisine: "Korean",
      dietary: [],
      sourceUrl: "https://example.com/bibimbap",
      photos: [],
    },
    {
      id: "9",
      name: "Falafel Wrap",
      instructions:
        "Blend soaked chickpeas with parsley, cilantro, garlic, cumin, and coriander. Form into balls and deep-fry at 350 F until crispy. Serve in warm pita with tahini sauce, pickled turnips, and fresh vegetables.",
      prepMinutes: 40,
      servings: 6,
      cuisine: "Middle Eastern",
      dietary: ["Vegetarian", "Vegan"],
      sourceUrl: "",
      photos: [],
    },
    {
      id: "10",
      name: "Ceviche",
      instructions:
        "Dice fresh white fish into small cubes. Marinate in lime juice for 30 minutes until opaque. Mix with diced red onion, tomato, jalapeño, cilantro, and avocado. Season with salt and serve with tortilla chips.",
      prepMinutes: 45,
      servings: 6,
      cuisine: "Peruvian",
      dietary: ["Gluten-Free", "Dairy-Free"],
      sourceUrl: "https://example.com/ceviche",
      photos: [
        { id: "r5", name: "ceviche.jpg", size: 250000, type: "image/jpeg" },
      ],
    },
  ];
}

// --- Options ---

const cuisineOptions = [
  { label: "Thai", value: "Thai" },
  { label: "Italian", value: "Italian" },
  { label: "Indian", value: "Indian" },
  { label: "Mexican", value: "Mexican" },
  { label: "Japanese", value: "Japanese" },
  { label: "Greek", value: "Greek" },
  { label: "French", value: "French" },
  { label: "Korean", value: "Korean" },
  { label: "Middle Eastern", value: "Middle Eastern" },
  { label: "Peruvian", value: "Peruvian" },
];

const dietaryOptions = [
  { label: "Vegetarian", value: "Vegetarian" },
  { label: "Vegan", value: "Vegan" },
  { label: "Gluten-Free", value: "Gluten-Free" },
  { label: "Dairy-Free", value: "Dairy-Free" },
  { label: "Nut-Free", value: "Nut-Free" },
  { label: "Low-Carb", value: "Low-Carb" },
  { label: "Keto", value: "Keto" },
];

// --- Demo component ---

/** Editable recipe collection with long-text instructions, multi-select dietary tags, and file uploads. */
export function RecipeBookDemo({ readOnly = false }: { readOnly?: boolean }) {
  const [data, setData] = useState(createRecipeData);

  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable column definitions
  const columns = useMemo<ColumnDef<Recipe>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Recipe",
        meta: { label: "Recipe", cell: { variant: "short-text" as const } },
        minSize: 160,
      },
      {
        id: "instructions",
        accessorKey: "instructions",
        header: "Instructions",
        meta: {
          label: "Instructions",
          cell: { variant: "long-text" as const },
        },
        minSize: 250,
      },
      {
        id: "prepMinutes",
        accessorKey: "prepMinutes",
        header: "Prep (min)",
        meta: {
          label: "Prep (min)",
          cell: {
            variant: "number" as const,
            min: 5,
            max: 480,
            step: 5,
          },
        },
        minSize: 110,
      },
      {
        id: "servings",
        accessorKey: "servings",
        header: "Servings",
        meta: {
          label: "Servings",
          cell: { variant: "number" as const, min: 1, max: 50 },
        },
        minSize: 100,
      },
      {
        id: "cuisine",
        accessorKey: "cuisine",
        header: "Cuisine",
        meta: {
          label: "Cuisine",
          cell: { variant: "select" as const, options: cuisineOptions },
        },
        minSize: 140,
      },
      {
        id: "dietary",
        accessorKey: "dietary",
        header: "Dietary",
        meta: {
          label: "Dietary",
          cell: {
            variant: "multi-select" as const,
            options: dietaryOptions,
          },
        },
        minSize: 200,
      },
      {
        id: "sourceUrl",
        accessorKey: "sourceUrl",
        header: "Source",
        meta: { label: "Source", cell: { variant: "url" as const } },
        minSize: 180,
      },
      {
        id: "photos",
        accessorKey: "photos",
        header: "Photos",
        meta: {
          label: "Photos",
          cell: {
            variant: "file" as const,
            accept: "image/*",
            multiple: true,
            maxFiles: 5,
          },
        },
        minSize: 180,
      },
    ],
    []
  );

  const onRowAdd = readOnly
    ? undefined
    : () => {
        const newRow: Recipe = {
          id: String(Date.now()),
          name: "",
          instructions: "",
          prepMinutes: 30,
          servings: 4,
          cuisine: "",
          dietary: [],
          sourceUrl: "",
          photos: [],
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
    rowHeight: "tall",
    readOnly,
  });

  return (
    <div className="w-full max-w-6xl space-y-2">
      <DataGridToolbar
        table={table}
        enableSort
        enableFilter
        enableRowHeight
        enableView
      />
      <DataGrid {...dataGridProps} table={table} height={450} stretchColumns />
    </div>
  );
}
