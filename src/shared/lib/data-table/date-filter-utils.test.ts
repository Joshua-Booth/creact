import { describe, expect, it } from "vitest";

import {
  formatDateRangeLabel,
  getIsDateRange,
  parseAsDate,
  parseColumnFilterValue,
} from "./date-filter-utils";

describe("getIsDateRange", () => {
  it("should return false for an array", () => {
    expect(getIsDateRange([])).toBe(false);
    expect(getIsDateRange([new Date()])).toBe(false);
  });

  it("should return true for an object", () => {
    expect(getIsDateRange({ from: new Date(), to: new Date() })).toBe(true);
    expect(getIsDateRange({ from: undefined, to: undefined })).toBe(true);
  });
});

describe("parseAsDate", () => {
  it("should return undefined for undefined input", () => {
    // eslint-disable-next-line unicorn/no-useless-undefined -- explicitly testing undefined parameter
    expect(parseAsDate(undefined)).toBeUndefined();
  });

  it("should return a Date for a valid number", () => {
    const ts = new Date(2026, 0, 15).getTime();
    const result = parseAsDate(ts);
    expect(result).toBeInstanceOf(Date);
    expect(result?.getTime()).toBe(ts);
  });

  it("should return a Date for a string number", () => {
    const ts = new Date(2026, 0, 15).getTime();
    const result = parseAsDate(String(ts));
    expect(result).toBeInstanceOf(Date);
    expect(result?.getTime()).toBe(ts);
  });

  it("should return undefined for NaN", () => {
    expect(parseAsDate(Number.NaN)).toBeUndefined();
  });

  it("should return undefined for a non-numeric string", () => {
    expect(parseAsDate("not-a-date")).toBeUndefined();
  });
});

describe("parseColumnFilterValue", () => {
  it("should return empty array for null", () => {
    expect(parseColumnFilterValue(null)).toEqual([]);
  });

  it("should return empty array for undefined", () => {
    // eslint-disable-next-line unicorn/no-useless-undefined -- explicitly testing undefined parameter
    expect(parseColumnFilterValue(undefined)).toEqual([]);
  });

  it("should return mapped array for number array", () => {
    expect(parseColumnFilterValue([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it("should return mapped array for string array", () => {
    expect(parseColumnFilterValue(["a", "b"])).toEqual(["a", "b"]);
  });

  it("should return undefined items for mixed types", () => {
    expect(parseColumnFilterValue([1, true, "x"])).toEqual([1, undefined, "x"]);
  });

  it("should wrap a single string in an array", () => {
    expect(parseColumnFilterValue("hello")).toEqual(["hello"]);
  });

  it("should wrap a single number in an array", () => {
    expect(parseColumnFilterValue(42)).toEqual([42]);
  });

  it("should return empty array for an object", () => {
    expect(parseColumnFilterValue({ foo: "bar" })).toEqual([]);
  });
});

describe("formatDateRangeLabel", () => {
  it("should return empty string when both from and to are null", () => {
    expect(formatDateRangeLabel({ from: undefined, to: undefined })).toBe("");
  });

  it("should return formatted range when both dates are set", () => {
    const from = new Date(2026, 0, 1);
    const to = new Date(2026, 0, 31);
    const result = formatDateRangeLabel({ from, to });
    expect(result).toContain(" - ");
    expect(result).toContain("January");
  });

  it("should return single date when only from is set", () => {
    const from = new Date(2026, 5, 15);
    const result = formatDateRangeLabel({ from, to: undefined });
    expect(result).toContain("June");
  });

  it("should return single date when only to is set", () => {
    const to = new Date(2026, 11, 25);
    const result = formatDateRangeLabel({ from: undefined, to });
    expect(result).toContain("December");
  });
});
