import type { Column, Table } from "@tanstack/react-table";

import type * as React from "react";
import {
  BaselineIcon,
  CalendarIcon,
  CheckSquareIcon,
  File,
  FileArchive,
  FileAudio,
  FileIcon,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  HashIcon,
  LinkIcon,
  ListChecksIcon,
  ListIcon,
  Presentation,
  TextInitialIcon,
} from "lucide-react";

import type {
  CellOpts,
  CellPosition,
  Direction,
  FileCellData,
  RowHeightValue,
} from "./types";

/**
 * Render a table cell component or string value.
 * @param Comp - The component function or string to render
 * @param props - Props to pass to the component
 * @returns The rendered React node
 */
export function flexRender<TProps extends object>(
  Comp: ((props: TProps) => React.ReactNode) | string | undefined,
  props: TProps
): React.ReactNode {
  if (typeof Comp === "string") {
    return Comp;
  }
  return Comp?.(props);
}

/**
 * Check if a value conforms to the FileCellData interface.
 * @param item - The value to check
 * @returns True if the item is FileCellData
 */
export function getIsFileCellData(item: unknown): item is FileCellData {
  return (
    item != null &&
    typeof item === "object" &&
    "id" in item &&
    "name" in item &&
    "size" in item &&
    "type" in item
  );
}

/**
 * Find a matching select option by value or label.
 * @param value - The value to match against
 * @param options - The available select options
 * @returns The matched option value, or undefined
 */
export function matchSelectOption(
  value: string,
  options: { value: string; label: string }[]
): string | undefined {
  return options.find(
    (o) =>
      o.value === value ||
      o.value.toLowerCase() === value.toLowerCase() ||
      o.label.toLowerCase() === value.toLowerCase()
  )?.value;
}

/**
 * Create a unique key for a cell from its row index and column ID.
 * @param rowIndex - The row index
 * @param columnId - The column identifier
 * @returns A string key in the format "rowIndex:columnId"
 */
export function getCellKey(rowIndex: number, columnId: string) {
  return `${rowIndex}:${columnId}`;
}

/**
 * Parse a cell key back into its row index and column ID.
 * @param cellKey - The cell key string to parse
 * @returns The parsed cell position
 */
export function parseCellKey(cellKey: string): Required<CellPosition> {
  const parts = cellKey.split(":");
  const rowIndexStr = parts[0];
  const columnId = parts[1];
  if (rowIndexStr && columnId) {
    const rowIndex = Number.parseInt(rowIndexStr, 10);
    if (!Number.isNaN(rowIndex)) {
      return { rowIndex, columnId };
    }
  }
  return { rowIndex: 0, columnId: "" };
}

/**
 * Convert a row height label to its pixel value.
 * @param rowHeight - The row height setting
 * @returns The height in pixels
 */
export function getRowHeightValue(rowHeight: RowHeightValue): number {
  const rowHeightMap: Record<RowHeightValue, number> = {
    short: 36,
    medium: 56,
    tall: 76,
    "extra-tall": 96,
  };

  return rowHeightMap[rowHeight];
}

/**
 * Get the number of text lines for a given row height.
 * @param rowHeight - The row height setting
 * @returns The number of visible text lines
 */
export function getLineCount(rowHeight: RowHeightValue): number {
  const lineCountMap: Record<RowHeightValue, number> = {
    short: 1,
    medium: 2,
    tall: 3,
    "extra-tall": 4,
  };

  return lineCountMap[rowHeight];
}

/**
 * Determine which borders should be visible for a column.
 * @param params - The column border parameters
 * @param params.column - The current column
 * @param params.nextColumn - The adjacent column to the right
 * @param params.isLastColumn - Whether this is the last column
 * @returns An object indicating which borders to show
 */
export function getColumnBorderVisibility<TData>(params: {
  column: Column<TData>;
  nextColumn?: Column<TData>;
  isLastColumn: boolean;
}): {
  showEndBorder: boolean;
  showStartBorder: boolean;
} {
  const { column, nextColumn, isLastColumn } = params;

  const isPinned = column.getIsPinned();
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right");
  const isLastRightPinnedColumn =
    isPinned === "right" && column.getIsLastColumn("right");

  const nextIsPinned = nextColumn?.getIsPinned();
  const isBeforeRightPinned =
    nextIsPinned === "right" && nextColumn?.getIsFirstColumn("right");

  const showEndBorder =
    !isBeforeRightPinned && (isLastColumn || !isLastRightPinnedColumn);

  const showStartBorder = isFirstRightPinnedColumn;

  return {
    showEndBorder,
    showStartBorder,
  };
}

/**
 * Calculate CSS styles for a pinned column.
 * @param params - The column pinning parameters
 * @param params.column - The column to style
 * @param params.withBorder - Whether to include border shadows
 * @param params.dir - The text direction
 * @returns CSS properties for the pinned column
 */
export function getColumnPinningStyle<TData>(params: {
  column: Column<TData>;
  withBorder?: boolean;
  dir?: Direction;
}): React.CSSProperties {
  const { column, dir = "ltr", withBorder = false } = params;

  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right");

  const isRtl = dir === "rtl";

  const leftPosition =
    isPinned === "left" ? `${column.getStart("left")}px` : undefined;
  const rightPosition =
    isPinned === "right" ? `${column.getAfter("right")}px` : undefined;

  let boxShadow: string | undefined;
  if (withBorder) {
    if (isLastLeftPinnedColumn) {
      boxShadow = isRtl
        ? "4px 0 4px -4px var(--border) inset"
        : "-4px 0 4px -4px var(--border) inset";
    } else if (isFirstRightPinnedColumn) {
      boxShadow = isRtl
        ? "-4px 0 4px -4px var(--border) inset"
        : "4px 0 4px -4px var(--border) inset";
    }
  }

  return {
    boxShadow,
    left: isRtl ? rightPosition : leftPosition,
    right: isRtl ? leftPosition : rightPosition,
    opacity: isPinned === false ? 1 : 0.97,
    position: isPinned === false ? "relative" : "sticky",
    background: "var(--background)",
    width: column.getSize(),
    zIndex: isPinned === false ? undefined : 1,
  };
}

/**
 * Map a direction string to a scroll direction.
 * @param direction - The input direction string
 * @returns The normalized scroll direction
 */
export function getScrollDirection(
  direction: string
): "left" | "right" | "home" | "end" | undefined {
  if (
    direction === "left" ||
    direction === "right" ||
    direction === "home" ||
    direction === "end"
  ) {
    return direction;
  }
  if (direction === "pageleft") return "left";
  if (direction === "pageright") return "right";
  return undefined;
}

/**
 * Scroll a cell into the visible viewport area.
 * @param params - The scroll parameters
 * @param params.container - The scrollable container element
 * @param params.targetCell - The cell element to scroll into view
 * @param params.tableRef - A ref to the table instance
 * @param params.viewportOffset - Pixel offset from viewport edges
 * @param params.direction - The scroll direction hint
 * @param params.isRtl - Whether the layout is right-to-left
 */
export function scrollCellIntoView<TData>(params: {
  container: HTMLDivElement;
  targetCell: HTMLDivElement;
  tableRef: React.RefObject<Table<TData> | null>;
  viewportOffset: number;
  direction?: "left" | "right" | "home" | "end";
  isRtl: boolean;
}): void {
  const { container, targetCell, tableRef, direction, viewportOffset, isRtl } =
    params;

  const containerRect = container.getBoundingClientRect();
  const cellRect = targetCell.getBoundingClientRect();

  const hasNegativeScroll = container.scrollLeft < 0;
  const isActuallyRtl = isRtl || hasNegativeScroll;

  const currentTable = tableRef.current;
  const leftPinnedColumns = currentTable?.getLeftVisibleLeafColumns() ?? [];
  const rightPinnedColumns = currentTable?.getRightVisibleLeafColumns() ?? [];

  const leftPinnedWidth = leftPinnedColumns.reduce(
    (sum, c) => sum + c.getSize(),
    0
  );
  const rightPinnedWidth = rightPinnedColumns.reduce(
    (sum, c) => sum + c.getSize(),
    0
  );

  const viewportLeft = isActuallyRtl
    ? containerRect.left + rightPinnedWidth + viewportOffset
    : containerRect.left + leftPinnedWidth + viewportOffset;
  const viewportRight = isActuallyRtl
    ? containerRect.right - leftPinnedWidth - viewportOffset
    : containerRect.right - rightPinnedWidth - viewportOffset;

  const isFullyVisible =
    cellRect.left >= viewportLeft && cellRect.right <= viewportRight;

  if (isFullyVisible) return;

  const isClippedRight = cellRect.right > viewportRight;

  let scrollDelta = 0;

  if (direction == null) {
    // Must be clipped left or right — cell can't reach here unless clipped
    scrollDelta = isClippedRight
      ? cellRect.right - viewportRight
      : -(viewportLeft - cellRect.left);
  } else {
    const shouldScrollRight = isActuallyRtl
      ? direction === "right" || direction === "home"
      : direction === "right" || direction === "end";

    scrollDelta = shouldScrollRight
      ? cellRect.right - viewportRight
      : -(viewportLeft - cellRect.left);
  }

  container.scrollLeft += scrollDelta;
}

/**
 * Check if an element is inside a popover or cell editor.
 * @param element - The element to check
 * @returns True if the element is inside a popover
 */
export function getIsInPopover(element: unknown): boolean {
  return (
    element instanceof Element &&
    (element.closest("[data-grid-cell-editor]") ??
      element.closest("[data-grid-popover]")) !== null
  );
}

/**
 * Get the icon and label for a column variant.
 * @param variant - The cell variant type
 * @returns An object with icon and label, or null
 */
export function getColumnVariant(variant?: CellOpts["variant"]): {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
} | null {
  switch (variant) {
    case "short-text":
      return { label: "Short text", icon: BaselineIcon };
    case "long-text":
      return { label: "Long text", icon: TextInitialIcon };
    case "number":
      return { label: "Number", icon: HashIcon };
    case "url":
      return { label: "URL", icon: LinkIcon };
    case "checkbox":
      return { label: "Checkbox", icon: CheckSquareIcon };
    case "select":
      return { label: "Select", icon: ListIcon };
    case "multi-select":
      return { label: "Multi-select", icon: ListChecksIcon };
    case "date":
      return { label: "Date", icon: CalendarIcon };
    case "file":
      return { label: "File", icon: FileIcon };
    default:
      return null;
  }
}

/**
 * Normalize a URL string by adding a protocol if missing.
 * @param urlString - The URL string to normalize
 * @returns The normalized URL href
 */
export function getUrlHref(urlString: string): string {
  if (urlString === "" || urlString.trim() === "") return "";

  const trimmed = urlString.trim();

  if (/^(javascript|data|vbscript|file):/i.test(trimmed)) {
    return "";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `http://${trimmed}`;
}

/**
 * Parse a date string in YYYY-MM-DD format into a Date object.
 * @param dateStr - The date value to parse
 * @returns The parsed Date object, or null if invalid
 */
export function parseLocalDate(dateStr: unknown): Date | null {
  if (dateStr == null) return null;
  if (dateStr instanceof Date) return dateStr;
  if (typeof dateStr !== "string") return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  if (
    /* istanbul ignore next -- unreachable: split always returns first element */
    year == null ||
    year === 0 ||
    month == null ||
    month === 0 ||
    day == null ||
    day === 0
  )
    return null;
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

/**
 * Format a Date object into a YYYY-MM-DD string.
 * @param date - The Date object to format
 * @returns The formatted date string
 */
export function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Format a date value for user-facing display.
 * @param dateStr - The date value to format
 * @returns The formatted display string
 */
export function formatDateForDisplay(dateStr: unknown): string {
  if (dateStr == null) return "";
  const date = parseLocalDate(dateStr);
  if (date == null) return typeof dateStr === "string" ? dateStr : "";
  return date.toLocaleDateString();
}

/**
 * Format a byte count into a human-readable file size string.
 * @param bytes - The number of bytes
 * @returns The formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes <= 0 || !Number.isFinite(bytes)) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    sizes.length - 1,
    Math.floor(Math.log(bytes) / Math.log(k))
  );
  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
}

/**
 * Get the appropriate file icon component for a MIME type.
 * @param type - The MIME type string
 * @returns The icon component for the file type
 */
export function getFileIcon(
  type: string
): React.ComponentType<React.SVGProps<SVGSVGElement>> {
  if (type.startsWith("image/")) return FileImage;
  if (type.startsWith("video/")) return FileVideo;
  if (type.startsWith("audio/")) return FileAudio;
  if (type.includes("pdf")) return FileText;
  if (type.includes("zip") || type.includes("rar")) return FileArchive;
  if (
    type.includes("word") ||
    type.includes("document") ||
    type.includes("doc")
  )
    return FileText;
  if (type.includes("sheet") || type.includes("excel") || type.includes("xls"))
    return FileSpreadsheet;
  if (
    type.includes("presentation") ||
    type.includes("powerpoint") ||
    type.includes("ppt")
  )
    return Presentation;
  return File;
}
