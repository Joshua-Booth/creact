import type { Column, Table } from "@tanstack/react-table";

import type React from "react";
import { describe, expect, it, vi } from "vitest";

import {
  flexRender,
  formatDateForDisplay,
  formatDateToString,
  formatFileSize,
  getCellKey,
  getColumnBorderVisibility,
  getColumnPinningStyle,
  getColumnVariant,
  getFileIcon,
  getIsFileCellData,
  getLineCount,
  getRowHeightValue,
  getScrollDirection,
  getUrlHref,
  matchSelectOption,
  parseCellKey,
  parseLocalDate,
  scrollCellIntoView,
} from "./data-grid";

describe("getCellKey / parseCellKey", () => {
  it("should round-trip encode a cell key", () => {
    const key = getCellKey(3, "title");
    const parsed = parseCellKey(key);
    expect(parsed).toEqual({ rowIndex: 3, columnId: "title" });
  });

  it("should handle zero row index", () => {
    const key = getCellKey(0, "status");
    expect(parseCellKey(key)).toEqual({ rowIndex: 0, columnId: "status" });
  });

  it("should return default for invalid key", () => {
    expect(parseCellKey("invalid")).toEqual({ rowIndex: 0, columnId: "" });
    expect(parseCellKey("")).toEqual({ rowIndex: 0, columnId: "" });
    expect(parseCellKey("abc:")).toEqual({ rowIndex: 0, columnId: "" });
  });

  it("should return default when row index is NaN", () => {
    expect(parseCellKey("abc:title")).toEqual({ rowIndex: 0, columnId: "" });
  });
});

describe("getRowHeightValue", () => {
  it("should return 36 for short", () => {
    expect(getRowHeightValue("short")).toBe(36);
  });

  it("should return 56 for medium", () => {
    expect(getRowHeightValue("medium")).toBe(56);
  });

  it("should return 76 for tall", () => {
    expect(getRowHeightValue("tall")).toBe(76);
  });

  it("should return 96 for extra-tall", () => {
    expect(getRowHeightValue("extra-tall")).toBe(96);
  });
});

describe("getLineCount", () => {
  it("should return 1 for short", () => {
    expect(getLineCount("short")).toBe(1);
  });

  it("should return 2 for medium", () => {
    expect(getLineCount("medium")).toBe(2);
  });

  it("should return 3 for tall", () => {
    expect(getLineCount("tall")).toBe(3);
  });

  it("should return 4 for extra-tall", () => {
    expect(getLineCount("extra-tall")).toBe(4);
  });
});

describe("getUrlHref", () => {
  it("should return empty string for empty input", () => {
    expect(getUrlHref("")).toBe("");
    expect(getUrlHref("   ")).toBe("");
  });

  it("should return URL as-is when it has http protocol", () => {
    expect(getUrlHref("http://example.com")).toBe("http://example.com");
    expect(getUrlHref("https://example.com")).toBe("https://example.com");
  });

  it("should prepend http:// for protocol-less URLs", () => {
    expect(getUrlHref("example.com")).toBe("http://example.com");
  });

  it("should block dangerous protocols", () => {
    expect(getUrlHref("javascript:alert(1)")).toBe("");
    expect(getUrlHref("data:text/html,<script>")).toBe("");
    expect(getUrlHref("vbscript:foo")).toBe("");
    expect(getUrlHref("file:///etc/passwd")).toBe("");
  });

  it("should trim whitespace", () => {
    expect(getUrlHref("  https://example.com  ")).toBe("https://example.com");
  });
});

describe("parseLocalDate", () => {
  it("should parse a valid YYYY-MM-DD string", () => {
    const date = parseLocalDate("2026-03-15");
    expect(date).toBeInstanceOf(Date);
    expect(date?.getFullYear()).toBe(2026);
    expect(date?.getMonth()).toBe(2);
    expect(date?.getDate()).toBe(15);
  });

  it("should return null for null/undefined", () => {
    expect(parseLocalDate(null)).toBeNull();
    // eslint-disable-next-line unicorn/no-useless-undefined -- testing explicit undefined arg
    expect(parseLocalDate(undefined)).toBeNull();
  });

  it("should return null for non-string values", () => {
    expect(parseLocalDate(42)).toBeNull();
  });

  it("should return a Date if given a Date", () => {
    const d = new Date(2026, 0, 1);
    expect(parseLocalDate(d)).toBe(d);
  });

  it("should return null for invalid date strings", () => {
    expect(parseLocalDate("not-a-date")).toBeNull();
    expect(parseLocalDate("2026-00-15")).toBeNull();
    expect(parseLocalDate("2026-13-01")).toBeNull();
    expect(parseLocalDate("2026-02-30")).toBeNull();
  });

  it("should return null for string with missing parts", () => {
    expect(parseLocalDate("2026")).toBeNull();
    expect(parseLocalDate("2026-01")).toBeNull();
  });

  it("should return null when year is zero", () => {
    expect(parseLocalDate("0-01-01")).toBeNull();
  });

  it("should return null when day is zero", () => {
    expect(parseLocalDate("2026-01-00")).toBeNull();
  });

  it("should return null for empty string", () => {
    expect(parseLocalDate("")).toBeNull();
  });
});

describe("formatDateToString", () => {
  it("should format a Date to YYYY-MM-DD", () => {
    const date = new Date(2026, 2, 15);
    expect(formatDateToString(date)).toBe("2026-03-15");
  });

  it("should pad single-digit months and days", () => {
    const date = new Date(2026, 0, 5);
    expect(formatDateToString(date)).toBe("2026-01-05");
  });
});

describe("formatDateForDisplay", () => {
  it("should return empty string for null", () => {
    expect(formatDateForDisplay(null)).toBe("");
    // eslint-disable-next-line unicorn/no-useless-undefined -- testing explicit undefined arg
    expect(formatDateForDisplay(undefined)).toBe("");
  });

  it("should format a valid date string", () => {
    const result = formatDateForDisplay("2026-03-15");
    expect(result).toBeTruthy();
    expect(result).not.toBe("");
  });

  it("should return original string for invalid date", () => {
    expect(formatDateForDisplay("not-a-date")).toBe("not-a-date");
  });
});

describe("formatFileSize", () => {
  it("should return 0 B for zero or negative", () => {
    expect(formatFileSize(0)).toBe("0 B");
    expect(formatFileSize(-1)).toBe("0 B");
  });

  it("should format bytes", () => {
    expect(formatFileSize(500)).toBe("500 B");
  });

  it("should format kilobytes", () => {
    expect(formatFileSize(1024)).toBe("1 KB");
    expect(formatFileSize(2048)).toBe("2 KB");
  });

  it("should format megabytes", () => {
    expect(formatFileSize(1048576)).toBe("1 MB");
  });

  it("should format gigabytes", () => {
    expect(formatFileSize(1073741824)).toBe("1 GB");
  });

  it("should handle Infinity", () => {
    expect(formatFileSize(Infinity)).toBe("0 B");
  });
});

describe("getFileIcon", () => {
  it("should return image icon for image types", () => {
    const icon = getFileIcon("image/png");
    expect(icon).toBeDefined();
  });

  it("should return video icon for video types", () => {
    const icon = getFileIcon("video/mp4");
    expect(icon).toBeDefined();
  });

  it("should return audio icon for audio types", () => {
    const icon = getFileIcon("audio/mpeg");
    expect(icon).toBeDefined();
  });

  it("should return text icon for PDF", () => {
    const icon = getFileIcon("application/pdf");
    expect(icon).toBeDefined();
  });

  it("should return archive icon for zip", () => {
    const icon = getFileIcon("application/zip");
    expect(icon).toBeDefined();
  });

  it("should return text icon for word documents", () => {
    const icon = getFileIcon("application/msword");
    expect(icon).toBeDefined();
  });

  it("should return spreadsheet icon for excel", () => {
    const icon = getFileIcon("application/vnd.ms-excel");
    expect(icon).toBeDefined();
  });

  it("should return presentation icon for powerpoint", () => {
    const icon = getFileIcon("application/vnd.ms-powerpoint");
    expect(icon).toBeDefined();
  });

  it("should return generic file icon for unknown types", () => {
    const icon = getFileIcon("application/octet-stream");
    expect(icon).toBeDefined();
  });

  // Verify all icons are distinct for key types
  it("should return different icons for different types", () => {
    const imageIcon = getFileIcon("image/png");
    const videoIcon = getFileIcon("video/mp4");
    const audioIcon = getFileIcon("audio/mpeg");
    expect(imageIcon).not.toBe(videoIcon);
    expect(videoIcon).not.toBe(audioIcon);
  });
});

describe("getIsFileCellData", () => {
  it("should return true for valid FileCellData", () => {
    expect(
      getIsFileCellData({
        id: "1",
        name: "test.pdf",
        size: 100,
        type: "application/pdf",
      })
    ).toBe(true);
  });

  it("should return false for null/undefined", () => {
    expect(getIsFileCellData(null)).toBe(false);
    // eslint-disable-next-line unicorn/no-useless-undefined -- testing explicit undefined arg
    expect(getIsFileCellData(undefined)).toBe(false);
  });

  it("should return false for non-objects", () => {
    expect(getIsFileCellData("string")).toBe(false);
    expect(getIsFileCellData(42)).toBe(false);
  });

  it("should return false for objects missing required fields", () => {
    expect(getIsFileCellData({ id: "1", name: "test" })).toBe(false);
    expect(getIsFileCellData({ id: "1" })).toBe(false);
  });
});

describe("matchSelectOption", () => {
  const options = [
    { value: "active", label: "Active" },
    { value: "draft", label: "Draft" },
  ];

  it("should match by exact value", () => {
    expect(matchSelectOption("active", options)).toBe("active");
  });

  it("should match by case-insensitive value", () => {
    expect(matchSelectOption("ACTIVE", options)).toBe("active");
  });

  it("should match by case-insensitive label", () => {
    expect(matchSelectOption("Draft", options)).toBe("draft");
  });

  it("should return undefined for no match", () => {
    expect(matchSelectOption("unknown", options)).toBeUndefined();
  });
});

describe("getColumnVariant", () => {
  it("should return correct variant for short-text", () => {
    const result = getColumnVariant("short-text");
    expect(result?.label).toBe("Short text");
    expect(result?.icon).toBeDefined();
  });

  it("should return correct variant for long-text", () => {
    expect(getColumnVariant("long-text")?.label).toBe("Long text");
  });

  it("should return correct variant for number", () => {
    expect(getColumnVariant("number")?.label).toBe("Number");
  });

  it("should return correct variant for url", () => {
    expect(getColumnVariant("url")?.label).toBe("URL");
  });

  it("should return correct variant for checkbox", () => {
    expect(getColumnVariant("checkbox")?.label).toBe("Checkbox");
  });

  it("should return correct variant for select", () => {
    expect(getColumnVariant("select")?.label).toBe("Select");
  });

  it("should return correct variant for multi-select", () => {
    expect(getColumnVariant("multi-select")?.label).toBe("Multi-select");
  });

  it("should return correct variant for date", () => {
    expect(getColumnVariant("date")?.label).toBe("Date");
  });

  it("should return correct variant for file", () => {
    expect(getColumnVariant("file")?.label).toBe("File");
  });

  it("should return null for undefined variant", () => {
    expect(getColumnVariant()).toBeNull();
  });
});

describe("getScrollDirection", () => {
  it("should return direction for known values", () => {
    expect(getScrollDirection("left")).toBe("left");
    expect(getScrollDirection("right")).toBe("right");
    expect(getScrollDirection("home")).toBe("home");
    expect(getScrollDirection("end")).toBe("end");
  });

  it("should map pageleft to left", () => {
    expect(getScrollDirection("pageleft")).toBe("left");
  });

  it("should map pageright to right", () => {
    expect(getScrollDirection("pageright")).toBe("right");
  });

  it("should return undefined for unknown directions", () => {
    expect(getScrollDirection("up")).toBeUndefined();
    expect(getScrollDirection("down")).toBeUndefined();
    expect(getScrollDirection("unknown")).toBeUndefined();
  });
});

describe("flexRender", () => {
  it("should return string directly", () => {
    expect(flexRender("hello", {})).toBe("hello");
  });

  it("should return undefined for undefined input", () => {
    expect(flexRender(undefined, {})).toBeUndefined();
  });

  it("should call function with props", () => {
    const fn = vi.fn((props: { name: string }) => `Hi ${props.name}`);
    const result = flexRender(fn, { name: "World" });
    expect(result).toBe("Hi World");
    expect(fn).toHaveBeenCalledWith({ name: "World" });
  });
});

function mockBorderColumn<TData>(overrides: {
  isPinned?: false | "left" | "right";
  isFirstRight?: boolean;
  isLastRight?: boolean;
}): Column<TData> {
  return {
    getIsPinned: () => overrides.isPinned ?? false,
    getIsFirstColumn: () => overrides.isFirstRight ?? false,
    getIsLastColumn: () => overrides.isLastRight ?? false,
  } as unknown as Column<TData>;
}

describe("getColumnBorderVisibility", () => {
  it("should show end border for unpinned non-last column", () => {
    const col = mockBorderColumn({ isPinned: false });
    const next = mockBorderColumn({ isPinned: false });
    const result = getColumnBorderVisibility({
      column: col,
      nextColumn: next,
      isLastColumn: false,
    });
    expect(result.showEndBorder).toBe(true);
    expect(result.showStartBorder).toBe(false);
  });

  it("should show end border for last column", () => {
    const col = mockBorderColumn({ isPinned: false });
    const result = getColumnBorderVisibility({
      column: col,
      isLastColumn: true,
    });
    expect(result.showEndBorder).toBe(true);
  });

  it("should hide end border before first right-pinned column", () => {
    const col = mockBorderColumn({ isPinned: false });
    const next = mockBorderColumn({ isPinned: "right", isFirstRight: true });
    const result = getColumnBorderVisibility({
      column: col,
      nextColumn: next,
      isLastColumn: false,
    });
    expect(result.showEndBorder).toBe(false);
  });

  it("should show start border for first right-pinned column", () => {
    const col = mockBorderColumn({ isPinned: "right", isFirstRight: true });
    const result = getColumnBorderVisibility({
      column: col,
      isLastColumn: false,
    });
    expect(result.showStartBorder).toBe(true);
  });

  it("should hide end border for last right-pinned column that is not last column", () => {
    const col = mockBorderColumn({ isPinned: "right", isLastRight: true });
    const result = getColumnBorderVisibility({
      column: col,
      isLastColumn: false,
    });
    expect(result.showEndBorder).toBe(false);
  });
});

function mockPinColumn<TData>(overrides: {
  isPinned?: false | "left" | "right";
  isLastLeft?: boolean;
  isFirstRight?: boolean;
  start?: number;
  after?: number;
  size?: number;
}): Column<TData> {
  return {
    getIsPinned: () => overrides.isPinned ?? false,
    getIsLastColumn: () => overrides.isLastLeft ?? false,
    getIsFirstColumn: () => overrides.isFirstRight ?? false,
    getStart: () => overrides.start ?? 0,
    getAfter: () => overrides.after ?? 0,
    getSize: () => overrides.size ?? 100,
  } as unknown as Column<TData>;
}

describe("getColumnPinningStyle", () => {
  it("should return relative position for unpinned column", () => {
    const col = mockPinColumn({ isPinned: false, size: 150 });
    const style = getColumnPinningStyle({ column: col });
    expect(style.position).toBe("relative");
    expect(style.opacity).toBe(1);
    expect(style.width).toBe(150);
    expect(style.zIndex).toBeUndefined();
    expect(style.boxShadow).toBeUndefined();
  });

  it("should return sticky position for left-pinned column", () => {
    const col = mockPinColumn({ isPinned: "left", start: 50, size: 100 });
    const style = getColumnPinningStyle({ column: col });
    expect(style.position).toBe("sticky");
    expect(style.left).toBe("50px");
    expect(style.right).toBeUndefined();
    expect(style.opacity).toBe(0.97);
    expect(style.zIndex).toBe(1);
  });

  it("should return sticky position for right-pinned column", () => {
    const col = mockPinColumn({ isPinned: "right", after: 30, size: 100 });
    const style = getColumnPinningStyle({ column: col });
    expect(style.position).toBe("sticky");
    expect(style.right).toBe("30px");
    expect(style.left).toBeUndefined();
  });

  it("should not add box shadow for middle pinned column with border", () => {
    const col = mockPinColumn({ isPinned: "left", isLastLeft: false });
    const style = getColumnPinningStyle({ column: col, withBorder: true });
    expect(style.boxShadow).toBeUndefined();
  });

  it("should add box shadow for last left-pinned column with border", () => {
    const col = mockPinColumn({ isPinned: "left", isLastLeft: true });
    const style = getColumnPinningStyle({ column: col, withBorder: true });
    expect(style.boxShadow).toBe("-4px 0 4px -4px var(--border) inset");
  });

  it("should add box shadow for first right-pinned column with border", () => {
    const col = mockPinColumn({ isPinned: "right", isFirstRight: true });
    const style = getColumnPinningStyle({ column: col, withBorder: true });
    expect(style.boxShadow).toBe("4px 0 4px -4px var(--border) inset");
  });

  it("should not add box shadow without border flag", () => {
    const col = mockPinColumn({ isPinned: "left", isLastLeft: true });
    const style = getColumnPinningStyle({ column: col });
    expect(style.boxShadow).toBeUndefined();
  });

  it("should swap left/right in RTL mode", () => {
    const col = mockPinColumn({ isPinned: "left", start: 50 });
    const style = getColumnPinningStyle({ column: col, dir: "rtl" });
    expect(style.right).toBe("50px");
    expect(style.left).toBeUndefined();
  });

  it("should swap right to left in RTL mode for right-pinned", () => {
    const col = mockPinColumn({ isPinned: "right", after: 30 });
    const style = getColumnPinningStyle({ column: col, dir: "rtl" });
    expect(style.left).toBe("30px");
    expect(style.right).toBeUndefined();
  });

  it("should swap box shadow direction in RTL for last left-pinned", () => {
    const col = mockPinColumn({ isPinned: "left", isLastLeft: true });
    const style = getColumnPinningStyle({
      column: col,
      withBorder: true,
      dir: "rtl",
    });
    expect(style.boxShadow).toBe("4px 0 4px -4px var(--border) inset");
  });

  it("should swap box shadow direction in RTL for first right-pinned", () => {
    const col = mockPinColumn({ isPinned: "right", isFirstRight: true });
    const style = getColumnPinningStyle({
      column: col,
      withBorder: true,
      dir: "rtl",
    });
    expect(style.boxShadow).toBe("-4px 0 4px -4px var(--border) inset");
  });
});

function createScrollMockElements(overrides?: {
  containerLeft?: number;
  containerRight?: number;
  cellLeft?: number;
  cellRight?: number;
  scrollLeft?: number;
}) {
  const container = {
    getBoundingClientRect: () => ({
      left: overrides?.containerLeft ?? 0,
      right: overrides?.containerRight ?? 500,
      top: 0,
      bottom: 400,
      width: 500,
      height: 400,
    }),
    scrollLeft: overrides?.scrollLeft ?? 0,
  } as unknown as HTMLDivElement;

  const targetCell = {
    getBoundingClientRect: () => ({
      left: overrides?.cellLeft ?? 100,
      right: overrides?.cellRight ?? 200,
      top: 0,
      bottom: 36,
      width: 100,
      height: 36,
    }),
  } as unknown as HTMLDivElement;

  const tableRef = {
    current: {
      getLeftVisibleLeafColumns: () => [],
      getRightVisibleLeafColumns: () => [],
    } as unknown as Table<unknown>,
  };

  return { container, targetCell, tableRef };
}

describe("scrollCellIntoView", () => {
  it("should not scroll when cell is fully visible", () => {
    const { container, targetCell, tableRef } = createScrollMockElements({
      containerLeft: 0,
      containerRight: 500,
      cellLeft: 100,
      cellRight: 200,
    });

    scrollCellIntoView({
      container,
      targetCell,
      tableRef,
      viewportOffset: 0,
      isRtl: false,
    });

    expect(container.scrollLeft).toBe(0);
  });

  it("should scroll right when cell is clipped right", () => {
    const { container, targetCell, tableRef } = createScrollMockElements({
      containerLeft: 0,
      containerRight: 500,
      cellLeft: 450,
      cellRight: 600,
    });

    scrollCellIntoView({
      container,
      targetCell,
      tableRef,
      viewportOffset: 0,
      isRtl: false,
    });

    expect(container.scrollLeft).toBe(100);
  });

  it("should scroll left when cell is clipped left", () => {
    const { container, targetCell, tableRef } = createScrollMockElements({
      containerLeft: 100,
      containerRight: 500,
      cellLeft: 50,
      cellRight: 150,
    });

    scrollCellIntoView({
      container,
      targetCell,
      tableRef,
      viewportOffset: 0,
      isRtl: false,
    });

    expect(container.scrollLeft).toBe(-50);
  });

  it("should scroll right with explicit right direction", () => {
    const { container, targetCell, tableRef } = createScrollMockElements({
      containerLeft: 0,
      containerRight: 500,
      cellLeft: 450,
      cellRight: 600,
    });

    scrollCellIntoView({
      container,
      targetCell,
      tableRef,
      viewportOffset: 0,
      direction: "right",
      isRtl: false,
    });

    expect(container.scrollLeft).toBe(100);
  });

  it("should scroll left with explicit left direction", () => {
    const { container, targetCell, tableRef } = createScrollMockElements({
      containerLeft: 100,
      containerRight: 500,
      cellLeft: 50,
      cellRight: 150,
    });

    scrollCellIntoView({
      container,
      targetCell,
      tableRef,
      viewportOffset: 0,
      direction: "left",
      isRtl: false,
    });

    expect(container.scrollLeft).toBe(-50);
  });

  it("should handle end direction in LTR (scrolls right)", () => {
    const { container, targetCell, tableRef } = createScrollMockElements({
      containerLeft: 0,
      containerRight: 500,
      cellLeft: 450,
      cellRight: 600,
    });

    scrollCellIntoView({
      container,
      targetCell,
      tableRef,
      viewportOffset: 0,
      direction: "end",
      isRtl: false,
    });

    expect(container.scrollLeft).toBe(100);
  });

  it("should handle home direction in LTR (scrolls left)", () => {
    const { container, targetCell, tableRef } = createScrollMockElements({
      containerLeft: 100,
      containerRight: 500,
      cellLeft: 50,
      cellRight: 150,
    });

    scrollCellIntoView({
      container,
      targetCell,
      tableRef,
      viewportOffset: 0,
      direction: "home",
      isRtl: false,
    });

    expect(container.scrollLeft).toBe(-50);
  });

  it("should swap home/end semantics in RTL", () => {
    const { container, targetCell, tableRef } = createScrollMockElements({
      containerLeft: 0,
      containerRight: 500,
      cellLeft: 450,
      cellRight: 600,
    });

    scrollCellIntoView({
      container,
      targetCell,
      tableRef,
      viewportOffset: 0,
      direction: "home",
      isRtl: true,
    });

    // In RTL, "home" scrolls right
    expect(container.scrollLeft).toBe(100);
  });

  it("should account for pinned column widths", () => {
    const container = {
      getBoundingClientRect: () => ({
        left: 0,
        right: 500,
        top: 0,
        bottom: 400,
        width: 500,
        height: 400,
      }),
      scrollLeft: 0,
    } as unknown as HTMLDivElement;

    const targetCell = {
      getBoundingClientRect: () => ({
        left: 100,
        right: 200,
        top: 0,
        bottom: 36,
        width: 100,
        height: 36,
      }),
    } as unknown as HTMLDivElement;

    const tableRef = {
      current: {
        getLeftVisibleLeafColumns: () => [{ getSize: () => 120 }],
        getRightVisibleLeafColumns: () => [],
      } as unknown as Table<unknown>,
    };

    scrollCellIntoView({
      container,
      targetCell,
      tableRef,
      viewportOffset: 0,
      isRtl: false,
    });

    // Cell left (100) < viewportLeft (0 + 120), so scrolls left
    expect(container.scrollLeft).toBe(-20);
  });

  it("should account for right-pinned column widths", () => {
    const container = {
      getBoundingClientRect: () => ({
        left: 0,
        right: 500,
        top: 0,
        bottom: 400,
        width: 500,
        height: 400,
      }),
      scrollLeft: 0,
    } as unknown as HTMLDivElement;

    const targetCell = {
      getBoundingClientRect: () => ({
        left: 350,
        right: 450,
        top: 0,
        bottom: 36,
        width: 100,
        height: 36,
      }),
    } as unknown as HTMLDivElement;

    const tableRef = {
      current: {
        getLeftVisibleLeafColumns: () => [],
        getRightVisibleLeafColumns: () => [{ getSize: () => 120 }],
      } as unknown as Table<unknown>,
    };

    scrollCellIntoView({
      container,
      targetCell,
      tableRef,
      viewportOffset: 0,
      isRtl: false,
    });

    // Cell right (450) > viewportRight (500 - 120 = 380), so scrolls right
    expect(container.scrollLeft).toBe(70);
  });

  it("should detect RTL from negative scrollLeft", () => {
    const { container, targetCell, tableRef } = createScrollMockElements({
      containerLeft: 0,
      containerRight: 500,
      cellLeft: 100,
      cellRight: 200,
      scrollLeft: -10,
    });

    scrollCellIntoView({
      container,
      targetCell,
      tableRef,
      viewportOffset: 0,
      isRtl: false,
    });

    // hasNegativeScroll = true, so isActuallyRtl = true
    // With RTL, viewportLeft uses rightPinnedWidth (0), viewportRight uses leftPinnedWidth (0)
    // Cell is fully visible, no scroll
    expect(container.scrollLeft).toBe(-10);
  });

  it("should handle null table ref gracefully", () => {
    const { container, targetCell } = createScrollMockElements({
      containerLeft: 0,
      containerRight: 500,
      cellLeft: 100,
      cellRight: 200,
    });

    const tableRef = { current: null };

    scrollCellIntoView({
      container,
      targetCell,
      tableRef: tableRef as unknown as React.RefObject<Table<unknown>>,
      viewportOffset: 0,
      isRtl: false,
    });

    expect(container.scrollLeft).toBe(0);
  });
});

describe("formatDateForDisplay edge cases", () => {
  it("should return empty string for non-string non-null value", () => {
    expect(formatDateForDisplay(42)).toBe("");
  });
});
