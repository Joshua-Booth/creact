import { describe, expect, it } from "vitest";

import { cn } from "./utils";

describe("cn", () => {
  it("should merge class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should handle conditional classes", () => {
    const isDisabled = false;
    const isActive = true;
    expect(cn("foo", isDisabled && "bar", "baz")).toBe("foo baz");
    expect(cn("foo", isActive && "bar", "baz")).toBe("foo bar baz");
  });

  it("should handle undefined and null values", () => {
    expect(cn("foo", undefined, null, "bar")).toBe("foo bar");
  });

  it("should merge Tailwind classes correctly", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("should handle empty inputs", () => {
    expect(cn()).toBe("");
    expect(cn("")).toBe("");
  });

  it("should handle array inputs", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
  });

  it("should handle object syntax", () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
  });

  it("should combine multiple input types", () => {
    expect(cn("foo", ["bar", "baz"], { qux: true })).toBe("foo bar baz qux");
  });
});
