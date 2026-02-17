import { describe, expect, it } from "vitest";

import {
  formatValue,
  getIsValidRange,
  parseValuesAsNumbers,
} from "./slider-filter-utils";

describe("getIsValidRange", () => {
  it("should return true for [number, number]", () => {
    expect(getIsValidRange([1, 2])).toBe(true);
  });

  it("should return false for single-element array", () => {
    expect(getIsValidRange([1])).toBe(false);
  });

  it("should return false when first element is not a number", () => {
    expect(getIsValidRange(["a", 2])).toBe(false);
  });

  it("should return false for non-array", () => {
    expect(getIsValidRange("not-array")).toBe(false);
    expect(getIsValidRange(42)).toBe(false);
    expect(getIsValidRange(null)).toBe(false);
  });

  it("should return false for three-element array", () => {
    expect(getIsValidRange([1, 2, 3])).toBe(false);
  });
});

describe("parseValuesAsNumbers", () => {
  it("should parse [number, number]", () => {
    expect(parseValuesAsNumbers([1, 2])).toEqual([1, 2]);
  });

  it("should parse [string, string] as numbers", () => {
    expect(parseValuesAsNumbers(["1", "2"])).toEqual([1, 2]);
  });

  it("should return undefined for [NaN, number]", () => {
    expect(parseValuesAsNumbers([Number.NaN, 1])).toBeUndefined();
  });

  it("should return undefined for wrong length", () => {
    expect(parseValuesAsNumbers([1])).toBeUndefined();
    expect(parseValuesAsNumbers([1, 2, 3])).toBeUndefined();
  });

  it("should return undefined for non-array", () => {
    expect(parseValuesAsNumbers("not-array")).toBeUndefined();
    expect(parseValuesAsNumbers(null)).toBeUndefined();
  });
});

describe("formatValue", () => {
  it("should format 1000 with locale separator", () => {
    const result = formatValue(1000);
    expect(result).toBe("1,000");
  });

  it("should format 0", () => {
    expect(formatValue(0)).toBe("0");
  });
});
