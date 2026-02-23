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

interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  mood: string[];
  releaseDate: number;
  bpm: number;
  durationSec: number;
  rating: number;
}

// --- Sample data ---

function createTrackData(): Track[] {
  return [
    {
      id: "1",
      title: "Bohemian Rhapsody",
      artist: "Queen",
      genre: "Rock",
      mood: ["Epic", "Dramatic"],
      releaseDate: new Date(1975, 9, 31).getTime(),
      bpm: 72,
      durationSec: 355,
      rating: 5,
    },
    {
      id: "2",
      title: "Get Lucky",
      artist: "Daft Punk",
      genre: "Funk",
      mood: ["Upbeat", "Groovy"],
      releaseDate: new Date(2013, 3, 19).getTime(),
      bpm: 116,
      durationSec: 369,
      rating: 4,
    },
    {
      id: "3",
      title: "So What",
      artist: "Miles Davis",
      genre: "Jazz",
      mood: ["Chill", "Mellow"],
      releaseDate: new Date(1959, 7, 17).getTime(),
      bpm: 136,
      durationSec: 562,
      rating: 5,
    },
    {
      id: "4",
      title: "Strobe",
      artist: "Deadmau5",
      genre: "Electronic",
      mood: ["Atmospheric", "Epic"],
      releaseDate: new Date(2009, 8, 22).getTime(),
      bpm: 128,
      durationSec: 637,
      rating: 5,
    },
    {
      id: "5",
      title: "Stairway to Heaven",
      artist: "Led Zeppelin",
      genre: "Rock",
      mood: ["Epic", "Mellow"],
      releaseDate: new Date(1971, 10, 8).getTime(),
      bpm: 82,
      durationSec: 482,
      rating: 5,
    },
    {
      id: "6",
      title: "Superstition",
      artist: "Stevie Wonder",
      genre: "Funk",
      mood: ["Upbeat", "Groovy"],
      releaseDate: new Date(1972, 9, 24).getTime(),
      bpm: 101,
      durationSec: 245,
      rating: 4,
    },
    {
      id: "7",
      title: "Clair de Lune",
      artist: "Debussy",
      genre: "Classical",
      mood: ["Chill", "Atmospheric"],
      releaseDate: new Date(1905, 0, 1).getTime(),
      bpm: 54,
      durationSec: 312,
      rating: 5,
    },
    {
      id: "8",
      title: "Blinding Lights",
      artist: "The Weeknd",
      genre: "Pop",
      mood: ["Upbeat", "Dramatic"],
      releaseDate: new Date(2019, 10, 29).getTime(),
      bpm: 171,
      durationSec: 200,
      rating: 4,
    },
    {
      id: "9",
      title: "Take Five",
      artist: "Dave Brubeck",
      genre: "Jazz",
      mood: ["Groovy", "Chill"],
      releaseDate: new Date(1959, 6, 1).getTime(),
      bpm: 172,
      durationSec: 324,
      rating: 5,
    },
    {
      id: "10",
      title: "Billie Jean",
      artist: "Michael Jackson",
      genre: "Pop",
      mood: ["Groovy", "Dramatic"],
      releaseDate: new Date(1983, 0, 2).getTime(),
      bpm: 117,
      durationSec: 294,
      rating: 5,
    },
    {
      id: "11",
      title: "Midnight City",
      artist: "M83",
      genre: "Electronic",
      mood: ["Atmospheric", "Upbeat"],
      releaseDate: new Date(2011, 9, 18).getTime(),
      bpm: 105,
      durationSec: 244,
      rating: 4,
    },
    {
      id: "12",
      title: "Smells Like Teen Spirit",
      artist: "Nirvana",
      genre: "Rock",
      mood: ["Epic", "Dramatic"],
      releaseDate: new Date(1991, 8, 10).getTime(),
      bpm: 117,
      durationSec: 301,
      rating: 5,
    },
    {
      id: "13",
      title: "Gymnopedie No.1",
      artist: "Erik Satie",
      genre: "Classical",
      mood: ["Chill", "Mellow"],
      releaseDate: new Date(1888, 0, 1).getTime(),
      bpm: 66,
      durationSec: 186,
      rating: 4,
    },
    {
      id: "14",
      title: "Redbone",
      artist: "Childish Gambino",
      genre: "R&B",
      mood: ["Groovy", "Mellow"],
      releaseDate: new Date(2016, 10, 10).getTime(),
      bpm: 81,
      durationSec: 327,
      rating: 4,
    },
    {
      id: "15",
      title: "Around the World",
      artist: "Daft Punk",
      genre: "Electronic",
      mood: ["Upbeat", "Groovy"],
      releaseDate: new Date(1997, 2, 17).getTime(),
      bpm: 121,
      durationSec: 429,
      rating: 4,
    },
  ];
}

// --- Options ---

const genreOptions = [
  { label: "Rock", value: "Rock" },
  { label: "Funk", value: "Funk" },
  { label: "Jazz", value: "Jazz" },
  { label: "Electronic", value: "Electronic" },
  { label: "Classical", value: "Classical" },
  { label: "Pop", value: "Pop" },
  { label: "R&B", value: "R&B" },
];

const moodOptions = [
  { label: "Epic", value: "Epic" },
  { label: "Dramatic", value: "Dramatic" },
  { label: "Upbeat", value: "Upbeat" },
  { label: "Groovy", value: "Groovy" },
  { label: "Chill", value: "Chill" },
  { label: "Mellow", value: "Mellow" },
  { label: "Atmospheric", value: "Atmospheric" },
];

// --- Helpers ---

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={i < rating ? "text-amber-500" : "text-muted-foreground/30"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// --- Demo ---

/** Music library table with dateRange filter, BPM range, star ratings, and genre badges. */
export function MusicLibraryDemo() {
  const data = useMemo(() => createTrackData(), []);

  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable reference for table config
  const columns = useMemo<ColumnDef<Track>[]>(
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
        id: "title",
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Title" />
        ),
        cell: ({ cell }) => (
          <div className="font-medium">{cell.getValue<string>()}</div>
        ),
        meta: {
          label: "Title",
          placeholder: "Search titles...",
          variant: "text",
          icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: "artist",
        accessorKey: "artist",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Artist" />
        ),
        cell: ({ cell }) => cell.getValue<string>(),
        meta: {
          label: "Artist",
          placeholder: "Search artists...",
          variant: "text",
          icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: "genre",
        accessorKey: "genre",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Genre" />
        ),
        cell: ({ cell }) => {
          const genre = cell.getValue<string>();
          const dotColors: Record<string, string> = {
            Rock: "bg-red-500",
            Funk: "bg-orange-500",
            Jazz: "bg-blue-500",
            Electronic: "bg-violet-500",
            Classical: "bg-amber-500",
            Pop: "bg-pink-500",
            "R&B": "bg-emerald-500",
          };
          const dotColor = dotColors[genre] ?? "bg-gray-500";
          return (
            <Badge variant="outline">
              <span className={cn("size-2 shrink-0 rounded-full", dotColor)} />
              {genre}
            </Badge>
          );
        },
        meta: {
          label: "Genre",
          variant: "select",
          options: genreOptions,
        },
        enableColumnFilter: true,
      },
      {
        id: "mood",
        accessorKey: "mood",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Mood" />
        ),
        cell: ({ cell }) => (
          <div className="flex flex-wrap gap-1">
            {cell.getValue<string[]>().map((m) => (
              <Badge key={m} variant="secondary" className="text-xs">
                {m}
              </Badge>
            ))}
          </div>
        ),
        meta: {
          label: "Mood",
          variant: "multiSelect",
          options: moodOptions,
        },
        enableColumnFilter: true,
      },
      {
        id: "releaseDate",
        accessorKey: "releaseDate",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Released" />
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
          label: "Released",
          variant: "dateRange",
          icon: CalendarIcon,
        },
        enableColumnFilter: true,
      },
      {
        id: "bpm",
        accessorKey: "bpm",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="BPM" />
        ),
        cell: ({ cell }) => (
          <div className="text-right font-mono text-xs tabular-nums">
            {cell.getValue<number>()}
          </div>
        ),
        meta: {
          label: "BPM",
          variant: "range",
          range: [40, 220] as [number, number],
        },
        enableColumnFilter: true,
      },
      {
        id: "durationSec",
        accessorKey: "durationSec",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Duration" />
        ),
        cell: ({ cell }) => (
          <div className="text-right tabular-nums">
            {formatDuration(cell.getValue<number>())}
          </div>
        ),
      },
      {
        id: "rating",
        accessorKey: "rating",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Rating" />
        ),
        cell: ({ cell }) => <StarRating rating={cell.getValue<number>()} />,
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
      sorting: [{ id: "artist", desc: false }],
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
