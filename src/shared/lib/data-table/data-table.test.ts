import type { Column } from "@tanstack/react-table";

import { describe, expect, it } from "vitest";

import type { ExtendedColumnFilter } from "./types";
import { dataTableConfig } from "./config";
import {
  getCommonPinningStyles,
  getDefaultFilterOperator,
  getFilterOperators,
  getValidFilters,
} from "./data-table";

describe("getFilterOperators", () => {
  it("should return text operators", () => {
    const ops = getFilterOperators("text");
    expect(ops).toBe(dataTableConfig.textOperators);
    expect(ops.length).toBeGreaterThan(0);
  });

  it("should return numeric operators for number", () => {
    expect(getFilterOperators("number")).toBe(dataTableConfig.numericOperators);
  });

  it("should return numeric operators for range", () => {
    expect(getFilterOperators("range")).toBe(dataTableConfig.numericOperators);
  });

  it("should return date operators", () => {
    expect(getFilterOperators("date")).toBe(dataTableConfig.dateOperators);
  });

  it("should return date operators for dateRange", () => {
    expect(getFilterOperators("dateRange")).toBe(dataTableConfig.dateOperators);
  });

  it("should return boolean operators", () => {
    expect(getFilterOperators("boolean")).toBe(
      dataTableConfig.booleanOperators
    );
  });

  it("should return select operators", () => {
    expect(getFilterOperators("select")).toBe(dataTableConfig.selectOperators);
  });

  it("should return multiSelect operators", () => {
    expect(getFilterOperators("multiSelect")).toBe(
      dataTableConfig.multiSelectOperators
    );
  });
});

describe("getDefaultFilterOperator", () => {
  it("should return iLike for text", () => {
    expect(getDefaultFilterOperator("text")).toBe("iLike");
  });

  it("should return eq for number", () => {
    expect(getDefaultFilterOperator("number")).toBe("eq");
  });

  it("should return eq for range", () => {
    expect(getDefaultFilterOperator("range")).toBe("eq");
  });

  it("should return eq for date", () => {
    expect(getDefaultFilterOperator("date")).toBe("eq");
  });

  it("should return eq for dateRange", () => {
    expect(getDefaultFilterOperator("dateRange")).toBe("eq");
  });

  it("should return eq for boolean", () => {
    expect(getDefaultFilterOperator("boolean")).toBe("eq");
  });

  it("should return eq for select", () => {
    expect(getDefaultFilterOperator("select")).toBe("eq");
  });

  it("should return inArray for multiSelect", () => {
    expect(getDefaultFilterOperator("multiSelect")).toBe("inArray");
  });
});

describe("getValidFilters", () => {
  it("should keep filters with non-empty string values", () => {
    const filters: ExtendedColumnFilter<{ title: string }>[] = [
      {
        id: "title",
        value: "test",
        variant: "text",
        operator: "iLike",
        filterId: "f1",
      },
    ];
    expect(getValidFilters(filters)).toHaveLength(1);
  });

  it("should remove filters with empty string values", () => {
    const filters: ExtendedColumnFilter<{ title: string }>[] = [
      {
        id: "title",
        value: "",
        variant: "text",
        operator: "iLike",
        filterId: "f1",
      },
    ];
    expect(getValidFilters(filters)).toHaveLength(0);
  });

  it("should keep filters with non-empty array values", () => {
    const filters: ExtendedColumnFilter<{ status: string }>[] = [
      {
        id: "status",
        value: ["active"],
        variant: "multiSelect",
        operator: "inArray",
        filterId: "f2",
      },
    ];
    expect(getValidFilters(filters)).toHaveLength(1);
  });

  it("should remove filters with empty array values", () => {
    const filters: ExtendedColumnFilter<{ status: string }>[] = [
      {
        id: "status",
        value: [],
        variant: "multiSelect",
        operator: "inArray",
        filterId: "f2",
      },
    ];
    expect(getValidFilters(filters)).toHaveLength(0);
  });

  it("should keep isEmpty/isNotEmpty operators regardless of value", () => {
    const filters: ExtendedColumnFilter<{ title: string }>[] = [
      {
        id: "title",
        value: "",
        variant: "text",
        operator: "isEmpty",
        filterId: "f3",
      },
      {
        id: "title",
        value: "",
        variant: "text",
        operator: "isNotEmpty",
        filterId: "f4",
      },
    ];
    expect(getValidFilters(filters)).toHaveLength(2);
  });

  it("should return empty array for empty input", () => {
    expect(getValidFilters([])).toHaveLength(0);
  });

  it("should keep filters with numeric string values", () => {
    const filters: ExtendedColumnFilter<{ budget: number }>[] = [
      {
        id: "budget",
        value: "0",
        variant: "number",
        operator: "eq",
        filterId: "f5",
      },
    ];
    expect(getValidFilters(filters)).toHaveLength(1);
  });
});

function createMockColumn(
  overrides: {
    isPinned?: false | "left" | "right";
    isLastLeft?: boolean;
    isFirstRight?: boolean;
    start?: number;
    after?: number;
    size?: number;
  } = {}
) {
  return {
    getIsPinned: () => overrides.isPinned ?? false,
    getIsLastColumn: (side: string) =>
      side === "left" ? (overrides.isLastLeft ?? false) : false,
    getIsFirstColumn: (side: string) =>
      side === "right" ? (overrides.isFirstRight ?? false) : false,
    getStart: () => overrides.start ?? 0,
    getAfter: () => overrides.after ?? 0,
    getSize: () => overrides.size ?? 150,
    columnDef: { size: overrides.size },
  } as unknown as Column<unknown>;
}

describe("getCommonPinningStyles", () => {
  it("should return relative position for unpinned column", () => {
    const styles = getCommonPinningStyles({ column: createMockColumn() });
    expect(styles.position).toBe("relative");
    expect(styles.opacity).toBe(1);
    expect(styles.left).toBeUndefined();
    expect(styles.right).toBeUndefined();
    expect(styles.zIndex).toBeUndefined();
    expect(styles.boxShadow).toBeUndefined();
  });

  it("should return sticky position for left-pinned column", () => {
    const styles = getCommonPinningStyles({
      column: createMockColumn({ isPinned: "left", start: 50 }),
    });
    expect(styles.position).toBe("sticky");
    expect(styles.left).toBe("50px");
    expect(styles.right).toBeUndefined();
    expect(styles.opacity).toBe(0.97);
    expect(styles.zIndex).toBe(1);
  });

  it("should return sticky position for right-pinned column", () => {
    const styles = getCommonPinningStyles({
      column: createMockColumn({ isPinned: "right", after: 100 }),
    });
    expect(styles.position).toBe("sticky");
    expect(styles.right).toBe("100px");
    expect(styles.left).toBeUndefined();
  });

  it("should add left border shadow for last left-pinned column with border", () => {
    const styles = getCommonPinningStyles({
      column: createMockColumn({ isPinned: "left", isLastLeft: true }),
      withBorder: true,
    });
    expect(styles.boxShadow).toBe("-4px 0 4px -4px var(--border) inset");
  });

  it("should add right border shadow for first right-pinned column with border", () => {
    const styles = getCommonPinningStyles({
      column: createMockColumn({ isPinned: "right", isFirstRight: true }),
      withBorder: true,
    });
    expect(styles.boxShadow).toBe("4px 0 4px -4px var(--border) inset");
  });

  it("should not add shadow for middle left-pinned column with border", () => {
    const styles = getCommonPinningStyles({
      column: createMockColumn({ isPinned: "left", isLastLeft: false }),
      withBorder: true,
    });
    expect(styles.boxShadow).toBeUndefined();
  });

  it("should not add border shadow without withBorder", () => {
    const styles = getCommonPinningStyles({
      column: createMockColumn({ isPinned: "left", isLastLeft: true }),
    });
    expect(styles.boxShadow).toBeUndefined();
  });

  it("should include column width", () => {
    const styles = getCommonPinningStyles({
      column: createMockColumn({ size: 200 }),
    });
    expect(styles.width).toBe(200);
  });

  it("should set maxWidth when column has explicit size", () => {
    const styles = getCommonPinningStyles({
      column: createMockColumn({ size: 120 }),
    });
    expect(styles.maxWidth).toBe(120);
  });

  it("should not set maxWidth when column has no explicit size", () => {
    const styles = getCommonPinningStyles({
      column: createMockColumn(),
    });
    expect(styles.maxWidth).toBeUndefined();
  });
});
