import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { BREAKPOINTS } from "./breakpoints";
import { useDevice, useIsMobile } from "./hooks";

function setWindowWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
}

describe("Device detection hooks", () => {
  let mqlListeners: Map<string, ((e: MediaQueryListEvent) => void)[]>;
  let mqlMatches: Map<string, boolean>;

  beforeEach(() => {
    mqlListeners = new Map();
    mqlMatches = new Map();

    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => {
        if (!mqlListeners.has(query)) {
          mqlListeners.set(query, []);
        }
        return {
          matches: mqlMatches.get(query) ?? false,
          media: query,
          addEventListener: (_event: string, listener: () => void) => {
            mqlListeners.get(query)!.push(listener);
          },
          removeEventListener: (_event: string, listener: () => void) => {
            const listeners = mqlListeners.get(query)!;
            const index = listeners.indexOf(listener);
            if (index > -1) {
              listeners.splice(index, 1);
            }
          },
        };
      })
    );
  });

  function triggerMediaQueryChange() {
    for (const listeners of mqlListeners.values()) {
      for (const listener of listeners) {
        listener({} as MediaQueryListEvent);
      }
    }
  }

  describe("useDevice", () => {
    it("should return mobile state for small screens", () => {
      setWindowWidth(767);
      const { result } = renderHook(() => useDevice());

      expect(result.current.isMobile).toBe(true);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isDesktop).toBe(false);
    });

    it("should return tablet state for medium screens", () => {
      setWindowWidth(800);
      const { result } = renderHook(() => useDevice());

      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(true);
      expect(result.current.isDesktop).toBe(false);
    });

    it("should return desktop state for large screens", () => {
      setWindowWidth(1024);
      const { result } = renderHook(() => useDevice());

      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isDesktop).toBe(true);
    });

    it("should update when window resizes", () => {
      setWindowWidth(767);
      const { result } = renderHook(() => useDevice());

      expect(result.current.isMobile).toBe(true);

      act(() => {
        setWindowWidth(1024);
        triggerMediaQueryChange();
      });

      expect(result.current.isMobile).toBe(false);
      expect(result.current.isDesktop).toBe(true);
    });

    it("should use correct breakpoints", () => {
      setWindowWidth(BREAKPOINTS.MOBILE - 1);
      const { result: mobileResult } = renderHook(() => useDevice());
      expect(mobileResult.current.isMobile).toBe(true);

      setWindowWidth(BREAKPOINTS.MOBILE);
      const { result: tabletResult } = renderHook(() => useDevice());
      expect(tabletResult.current.isTablet).toBe(true);

      setWindowWidth(BREAKPOINTS.TABLET);
      const { result: desktopResult } = renderHook(() => useDevice());
      expect(desktopResult.current.isDesktop).toBe(true);
    });
  });

  describe("useIsMobile", () => {
    it("should return true for mobile screens", () => {
      setWindowWidth(767);
      const { result } = renderHook(() => useIsMobile());
      expect(result.current).toBe(true);
    });

    it("should return false for tablet screens", () => {
      setWindowWidth(800);
      const { result } = renderHook(() => useIsMobile());
      expect(result.current).toBe(false);
    });

    it("should return false for desktop screens", () => {
      setWindowWidth(1024);
      const { result } = renderHook(() => useIsMobile());
      expect(result.current).toBe(false);
    });
  });
});
