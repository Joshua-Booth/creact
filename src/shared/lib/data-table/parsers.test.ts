import { describe, expect, it } from "vitest";

import { getFiltersStateParser, getSortingStateParser } from "./parsers";

interface TestData {
  title: string;
  status: string;
}

describe("getSortingStateParser", () => {
  it("should parse valid sorting JSON", () => {
    const parser = getSortingStateParser<TestData>(["title", "status"]);
    const result = parser.parse('[{"id":"title","desc":false}]');
    expect(result).toEqual([{ id: "title", desc: false }]);
  });

  it("should return null for invalid JSON", () => {
    const parser = getSortingStateParser<TestData>();
    expect(parser.parse("not-json")).toBeNull();
  });

  it("should return null for invalid schema", () => {
    const parser = getSortingStateParser<TestData>();
    expect(parser.parse('[{"id":123}]')).toBeNull();
  });

  it("should return null when column ID is not in allowed set", () => {
    const parser = getSortingStateParser<TestData>(["title"]);
    expect(parser.parse('[{"id":"unknown","desc":false}]')).toBeNull();
  });

  it("should serialize sorting state", () => {
    const parser = getSortingStateParser<TestData>();
    const serialized = parser.serialize([{ id: "title", desc: true }]);
    expect(JSON.parse(serialized)).toEqual([{ id: "title", desc: true }]);
  });

  it("should compare equal arrays", () => {
    const parser = getSortingStateParser<TestData>();
    const a = [{ id: "title" as const, desc: false }];
    const b = [{ id: "title" as const, desc: false }];
    expect(parser.eq(a, b)).toBe(true);
  });

  it("should detect unequal arrays", () => {
    const parser = getSortingStateParser<TestData>();
    const a = [{ id: "title" as const, desc: false }];
    const b = [{ id: "title" as const, desc: true }];
    expect(parser.eq(a, b)).toBe(false);
  });

  it("should detect different length arrays as unequal", () => {
    const parser = getSortingStateParser<TestData>();
    const a = [{ id: "title" as const, desc: false }];
    const b: typeof a = [];
    expect(parser.eq(a, b)).toBe(false);
  });

  it("should accept Set of column IDs", () => {
    const parser = getSortingStateParser<TestData>(new Set(["title"]));
    const result = parser.parse('[{"id":"title","desc":false}]');
    expect(result).toEqual([{ id: "title", desc: false }]);
  });
});

describe("getFiltersStateParser", () => {
  it("should parse valid filter JSON", () => {
    const parser = getFiltersStateParser<TestData>(["title"]);
    const input = JSON.stringify([
      {
        id: "title",
        value: "test",
        variant: "text",
        operator: "iLike",
        filterId: "f1",
      },
    ]);
    const result = parser.parse(input);
    expect(result).toHaveLength(1);
    expect(result?.[0]?.id).toBe("title");
  });

  it("should return null for invalid JSON", () => {
    const parser = getFiltersStateParser<TestData>();
    expect(parser.parse("not-json")).toBeNull();
  });

  it("should return null for invalid schema", () => {
    const parser = getFiltersStateParser<TestData>();
    expect(parser.parse('[{"id":"title"}]')).toBeNull();
  });

  it("should return null when column ID is not in allowed set", () => {
    const parser = getFiltersStateParser<TestData>(["title"]);
    const input = JSON.stringify([
      {
        id: "unknown",
        value: "test",
        variant: "text",
        operator: "iLike",
        filterId: "f1",
      },
    ]);
    expect(parser.parse(input)).toBeNull();
  });

  it("should serialize filter state", () => {
    const parser = getFiltersStateParser<TestData>();
    const data = [
      {
        id: "title" as const,
        value: "test",
        variant: "text" as const,
        operator: "iLike" as const,
        filterId: "f1",
      },
    ];
    const serialized = parser.serialize(data);
    expect(JSON.parse(serialized)).toEqual(data);
  });

  it("should compare equal filter arrays", () => {
    const parser = getFiltersStateParser<TestData>();
    const a = [
      {
        id: "title" as const,
        value: "test",
        variant: "text" as const,
        operator: "iLike" as const,
        filterId: "f1",
      },
    ];
    const b = [
      {
        id: "title" as const,
        value: "test",
        variant: "text" as const,
        operator: "iLike" as const,
        filterId: "f1",
      },
    ];
    expect(parser.eq(a, b)).toBe(true);
  });

  it("should detect unequal filter arrays", () => {
    const parser = getFiltersStateParser<TestData>();
    const a = [
      {
        id: "title" as const,
        value: "test",
        variant: "text" as const,
        operator: "iLike" as const,
        filterId: "f1",
      },
    ];
    const b = [
      {
        id: "title" as const,
        value: "different",
        variant: "text" as const,
        operator: "iLike" as const,
        filterId: "f1",
      },
    ];
    expect(parser.eq(a, b)).toBe(false);
  });

  it("should parse with array values", () => {
    const parser = getFiltersStateParser<TestData>();
    const input = JSON.stringify([
      {
        id: "status",
        value: ["active", "draft"],
        variant: "multiSelect",
        operator: "inArray",
        filterId: "f2",
      },
    ]);
    const result = parser.parse(input);
    expect(result).toHaveLength(1);
    expect(result?.[0]?.value).toEqual(["active", "draft"]);
  });

  it("should accept Set of column IDs", () => {
    const parser = getFiltersStateParser<TestData>(new Set(["title"]));
    const input = JSON.stringify([
      {
        id: "title",
        value: "test",
        variant: "text",
        operator: "iLike",
        filterId: "f1",
      },
    ]);
    const result = parser.parse(input);
    expect(result).toHaveLength(1);
  });
});
