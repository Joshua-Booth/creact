import { beforeEach, describe, expect, it, vi } from "vitest";
import { isDesktop, isMobile, isTablet } from "./utils";

describe("Device detection utilities", () => {
  beforeEach(() => {
    vi.stubGlobal("innerWidth", 0);
  });

  describe("isMobile", () => {
    it("should return true when window width is less than 768px", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 767,
      });
      expect(isMobile()).toBe(true);
    });

    it("should return false when window width is 768px or more", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 768,
      });
      expect(isMobile()).toBe(false);
    });

    it("should return true for very small screens", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 320,
      });
      expect(isMobile()).toBe(true);
    });
  });

  describe("isTablet", () => {
    it("should return true when window width is between 768px and 1023px", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 800,
      });
      expect(isTablet()).toBe(true);
    });

    it("should return false when window width is less than 768px", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 767,
      });
      expect(isTablet()).toBe(false);
    });

    it("should return false when window width is 1024px or more", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1024,
      });
      expect(isTablet()).toBe(false);
    });

    it("should return true at lower tablet boundary (768px)", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 768,
      });
      expect(isTablet()).toBe(true);
    });

    it("should return true at upper tablet boundary (1023px)", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1023,
      });
      expect(isTablet()).toBe(true);
    });
  });

  describe("isDesktop", () => {
    it("should return true when window width is 1024px or more", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1024,
      });
      expect(isDesktop()).toBe(true);
    });

    it("should return false when window width is less than 1024px", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1023,
      });
      expect(isDesktop()).toBe(false);
    });

    it("should return true for large desktop screens", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1920,
      });
      expect(isDesktop()).toBe(true);
    });
  });
});
