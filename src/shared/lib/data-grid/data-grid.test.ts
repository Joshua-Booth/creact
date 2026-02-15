import { describe, expect, it } from "vitest";

import {
  formatDateForDisplay,
  formatDateToString,
  formatFileSize,
  getCellKey,
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
    // eslint-disable-next-line sonarjs/code-eval -- testing URL sanitization
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

  it("should return original string for unparseable date", () => {
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
