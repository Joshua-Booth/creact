import { describe, expect, it } from "vitest";

import { buildColumnFilters } from "./use-data-table";

describe("buildColumnFilters", () => {
  it("should return empty array for empty input", () => {
    expect(buildColumnFilters({})).toEqual([]);
  });

  it("should skip null values", () => {
    expect(buildColumnFilters({ status: null })).toEqual([]);
  });

  it("should pass through array values", () => {
    expect(buildColumnFilters({ status: ["active", "draft"] })).toEqual([
      { id: "status", value: ["active", "draft"] },
    ]);
  });

  it("should wrap plain string in array", () => {
    expect(buildColumnFilters({ name: "alice" })).toEqual([
      { id: "name", value: ["alice"] },
    ]);
  });

  it("should split string with special characters", () => {
    expect(buildColumnFilters({ tags: "foo.bar,baz" })).toEqual([
      { id: "tags", value: ["foo", "bar", "baz"] },
    ]);
  });

  it("should handle mixed null and valid values", () => {
    const result = buildColumnFilters({
      status: ["active"],
      name: null,
      role: "admin",
    });
    expect(result).toEqual([
      { id: "status", value: ["active"] },
      { id: "role", value: ["admin"] },
    ]);
  });
});
