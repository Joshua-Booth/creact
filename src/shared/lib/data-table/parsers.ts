import { createParser } from "nuqs/server";
import * as z from "zod";

import type { ExtendedColumnFilter, ExtendedColumnSort } from "./types";
import { dataTableConfig } from "./config";

const sortingItemSchema = z.object({
  id: z.string(),
  desc: z.boolean(),
});

function toSet(columnIds: string[] | Set<string>): Set<string> {
  return columnIds instanceof Set ? columnIds : new Set(columnIds);
}

/**
 * Build a nuqs parser for sorting state with optional column-ID validation.
 * @param columnIds - Allowed column identifiers for sorting
 * @returns A nuqs-compatible parser for sorting state
 */
export function getSortingStateParser<TData>(
  columnIds?: string[] | Set<string>
) {
  const validKeys = columnIds == null ? null : toSet(columnIds);

  return createParser({
    parse: (value) => {
      try {
        const parsed = JSON.parse(value);
        const result = z.array(sortingItemSchema).safeParse(parsed);

        if (!result.success) return null;

        if (
          validKeys != null &&
          result.data.some((item) => !validKeys.has(item.id))
        ) {
          return null;
        }

        return result.data as ExtendedColumnSort<TData>[];
      } catch {
        return null;
      }
    },
    serialize: (value) => JSON.stringify(value),
    eq: (a, b) =>
      a.length === b.length &&
      /* eslint-disable @typescript-eslint/no-unnecessary-condition -- defensive index access */
      a.every((item, index) => {
        const other = b[index];
        return item.id === other?.id && item.desc === other?.desc;
      }),
    /* eslint-enable @typescript-eslint/no-unnecessary-condition -- re-enable after defensive block */
  });
}

const filterItemSchema = z.object({
  id: z.string(),
  value: z.union([z.string(), z.array(z.string())]),
  variant: z.enum(dataTableConfig.filterVariants),
  operator: z.enum(dataTableConfig.operators),
  filterId: z.string(),
});

export type FilterItemSchema = z.infer<typeof filterItemSchema>;

/**
 * Build a nuqs parser for filter state with optional column-ID validation.
 * @param columnIds - Allowed column identifiers for filtering
 * @returns A nuqs-compatible parser for filter state
 */
export function getFiltersStateParser<TData>(
  columnIds?: string[] | Set<string>
) {
  const validKeys = columnIds == null ? null : toSet(columnIds);

  return createParser({
    parse: (value) => {
      try {
        const parsed = JSON.parse(value);
        const result = z.array(filterItemSchema).safeParse(parsed);

        if (!result.success) return null;

        if (
          validKeys != null &&
          result.data.some((item) => !validKeys.has(item.id))
        ) {
          return null;
        }

        return result.data as ExtendedColumnFilter<TData>[];
      } catch {
        return null;
      }
    },
    serialize: (value) => JSON.stringify(value),
    eq: (a, b) =>
      a.length === b.length &&
      /* eslint-disable @typescript-eslint/no-unnecessary-condition -- defensive index access */
      a.every((filter, index) => {
        const other = b[index];
        return (
          filter.id === other?.id &&
          filter.value === other?.value &&
          filter.variant === other?.variant &&
          filter.operator === other?.operator
        );
      }),
    /* eslint-enable @typescript-eslint/no-unnecessary-condition -- re-enable after defensive block */
  });
}
