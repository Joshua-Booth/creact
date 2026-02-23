/**
 * Format a date value using `Intl.DateTimeFormat`.
 * @param date - Date value to format
 * @param opts - Intl date-time format options
 * @returns The formatted date string, or empty string on failure
 */
export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {}
) {
  if (date == null) return "";
  if (typeof date === "string" && date === "") return "";
  if (typeof date === "number" && Number.isNaN(date)) return "";

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: opts.month ?? "long",
      day: opts.day ?? "numeric",
      year: opts.year ?? "numeric",
      ...opts,
    }).format(new Date(date));
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("[formatDate] Failed to format date:", date, error);
    }
    return "";
  }
}
