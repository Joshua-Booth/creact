import { describe, expect, it } from "vitest";

import { formatDate } from "./format";

describe("formatDate", () => {
  it("should format a Date object", () => {
    const result = formatDate(new Date(2026, 2, 15));
    expect(result).toContain("March");
    expect(result).toContain("15");
    expect(result).toContain("2026");
  });

  it("should format a timestamp number", () => {
    const result = formatDate(new Date(2026, 0, 1).getTime());
    expect(result).toContain("January");
    expect(result).toContain("2026");
  });

  it("should format a date string", () => {
    const result = formatDate("2026-06-20");
    expect(result).toBeTruthy();
    expect(result).not.toBe("");
  });

  it("should return empty string for undefined", () => {
    // eslint-disable-next-line unicorn/no-useless-undefined -- testing explicit undefined arg
    expect(formatDate(undefined)).toBe("");
  });

  it("should return empty string for null", () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any -- testing null safety
    expect(formatDate(null as any)).toBe("");
  });

  it("should return empty string for empty string", () => {
    expect(formatDate("")).toBe("");
  });

  it("should return empty string for NaN", () => {
    expect(formatDate(Number.NaN)).toBe("");
  });

  it("should apply custom options", () => {
    const result = formatDate(new Date(2026, 2, 15), {
      month: "short",
      day: "2-digit",
    });
    expect(result).toContain("Mar");
  });
});
