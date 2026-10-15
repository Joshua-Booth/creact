import { formatDate } from "./format";

interface DateRange {
  from?: Date;
  to?: Date;
}

type DateSelection = Date[] | DateRange;

/**
 * @param value - date selection to check
 * @returns whether the value is a DateRange object
 */
export function getIsDateRange(value: DateSelection): value is DateRange {
  return !Array.isArray(value);
}

/**
 * @param timestamp - numeric or string timestamp to parse
 * @returns parsed Date or undefined if invalid
 */
export function parseAsDate(
  timestamp: number | string | undefined
): Date | undefined {
  if (timestamp == null) return undefined;
  const numericTimestamp =
    typeof timestamp === "string" ? Number(timestamp) : timestamp;
  const date = new Date(numericTimestamp);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/**
 * @param value - column filter value to parse
 * @returns array of parsed numeric or string values
 */
export function parseColumnFilterValue(
  value: unknown
): (number | string | undefined)[] {
  if (value === null || value === undefined) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) =>
      typeof item === "number" || typeof item === "string" ? item : undefined
    );
  }

  if (typeof value === "string" || typeof value === "number") {
    return [value];
  }

  return [];
}

/**
 * @param range - date range to format
 * @returns formatted label string
 */
export function formatDateRangeLabel(range: DateRange): string {
  if (range.from == null && range.to == null) return "";
  if (range.from != null && range.to != null) {
    return `${formatDate(range.from)} - ${formatDate(range.to)}`;
  }
  // At least one of from/to is non-null after earlier checks
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- guaranteed by guards above
  const singleDate = (range.from ?? range.to)!;
  return formatDate(singleDate);
}
