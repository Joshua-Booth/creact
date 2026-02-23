type RangeValue = [number, number];

/**
 * @param value - value to validate as a numeric range tuple
 * @returns whether the value is a valid [min, max] range
 */
export function getIsValidRange(value: unknown): value is RangeValue {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number"
  );
}

/**
 * @param value - filter value to parse as a numeric range
 * @returns parsed [number, number] tuple or undefined if invalid
 */
export function parseValuesAsNumbers(value: unknown): RangeValue | undefined {
  if (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every(
      (v) =>
        (typeof v === "string" || typeof v === "number") && !Number.isNaN(v)
    )
  ) {
    return [Number(value[0]), Number(value[1])];
  }

  return undefined;
}

/**
 * @param value - number to format for display
 * @returns locale-formatted string with no decimal places
 */
export function formatValue(value: number) {
  return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
}
