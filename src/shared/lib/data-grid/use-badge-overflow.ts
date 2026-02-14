import { useEffect, useMemo, useState } from "react";

import type { RefObject } from "react";

const badgeWidthCache = new Map<string, number>();

const DEFAULT_CONTAINER_PADDING = 16;
const DEFAULT_BADGE_GAP = 4;
const DEFAULT_OVERFLOW_BADGE_WIDTH = 40;

interface MeasureBadgeWidthProps {
  label: string;
  cacheKey: string;
  iconSize?: number;
  maxWidth?: number;
  className?: string;
}

function measureBadgeWidth({
  label,
  cacheKey,
  iconSize,
  maxWidth,
  className,
}: MeasureBadgeWidthProps): number {
  const cached = badgeWidthCache.get(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  const measureEl = document.createElement("div");
  measureEl.className = `inline-flex items-center rounded-md border px-1.5 text-xs font-semibold h-5 gap-1 shrink-0 absolute invisible pointer-events-none ${
    className ?? ""
  }`;
  measureEl.style.whiteSpace = "nowrap";

  if (iconSize != null && iconSize !== 0) {
    const icon = document.createElement("span");
    icon.className = "shrink-0";
    icon.style.width = `${iconSize}px`;
    icon.style.height = `${iconSize}px`;
    measureEl.appendChild(icon);
  }

  if (maxWidth != null && maxWidth !== 0) {
    const text = document.createElement("span");
    text.className = "truncate";
    text.style.maxWidth = `${maxWidth}px`;
    text.textContent = label;
    measureEl.appendChild(text);
  } else {
    measureEl.textContent = label;
  }

  document.body.appendChild(measureEl);
  const width = measureEl.offsetWidth;
  document.body.removeChild(measureEl);

  badgeWidthCache.set(cacheKey, width);
  return width;
}

interface UseBadgeOverflowProps<T> {
  items: T[];
  getLabel: (item: T) => string;
  containerRef: RefObject<HTMLElement | null>;
  lineCount: number;
  cacheKeyPrefix?: string;
  iconSize?: number;
  maxWidth?: number;
  className?: string;
  containerPadding?: number;
  badgeGap?: number;
  overflowBadgeWidth?: number;
}

interface UseBadgeOverflowReturn<T> {
  visibleItems: T[];
  hiddenCount: number;
  containerWidth: number;
}

/**
 * Calculate which badge items are visible given container width constraints.
 * @param root0 - The badge overflow configuration
 * @param root0.items - The items to display as badges
 * @param root0.getLabel - Function to extract label text from an item
 * @param root0.containerRef - Ref to the container element
 * @param root0.lineCount - Maximum number of badge lines
 * @param root0.cacheKeyPrefix - Optional prefix for width cache keys
 * @param root0.containerPadding - Padding inside the container in pixels
 * @param root0.badgeGap - Gap between badges in pixels
 * @param root0.overflowBadgeWidth - Width of the overflow count badge
 * @param root0.iconSize - Size of badge icons in pixels
 * @param root0.maxWidth - Maximum badge text width in pixels
 * @param root0.className - CSS class for badge measurement
 * @returns Visible items, hidden count, and container width
 */
export function useBadgeOverflow<T>({
  items,
  getLabel,
  containerRef,
  lineCount,
  cacheKeyPrefix = "",
  containerPadding = DEFAULT_CONTAINER_PADDING,
  badgeGap = DEFAULT_BADGE_GAP,
  overflowBadgeWidth = DEFAULT_OVERFLOW_BADGE_WIDTH,
  iconSize,
  maxWidth,
  className,
}: UseBadgeOverflowProps<T>): UseBadgeOverflowReturn<T> {
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    function measureWidth() {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth - containerPadding;
        // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect -- intentional: sync container width from ResizeObserver
        setContainerWidth(width);
      }
    }

    measureWidth();

    const resizeObserver = new ResizeObserver(measureWidth);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, containerPadding]);

  const result = useMemo(() => {
    if (containerWidth === 0 || items.length === 0) {
      return { visibleItems: items, hiddenCount: 0, containerWidth };
    }

    let currentLineWidth = 0;
    let currentLine = 1;
    const visible: T[] = [];

    for (const item of items) {
      const label = getLabel(item);
      const cacheKey =
        cacheKeyPrefix === "" ? label : `${cacheKeyPrefix}:${label}`;
      const badgeWidth = measureBadgeWidth({
        label,
        cacheKey,
        iconSize,
        maxWidth,
        className,
      });
      const widthWithGap = badgeWidth + badgeGap;

      if (currentLineWidth + widthWithGap <= containerWidth) {
        currentLineWidth += widthWithGap;
        visible.push(item);
      } else if (currentLine < lineCount) {
        currentLine++;
        currentLineWidth = widthWithGap;
        visible.push(item);
      } else {
        if (
          currentLineWidth + overflowBadgeWidth > containerWidth &&
          visible.length > 0
        ) {
          visible.pop();
        }

        break;
      }
    }

    return {
      visibleItems: visible,
      hiddenCount: Math.max(0, items.length - visible.length),
      containerWidth,
    };
  }, [
    items,
    getLabel,
    containerWidth,
    lineCount,
    cacheKeyPrefix,
    iconSize,
    maxWidth,
    className,
    badgeGap,
    overflowBadgeWidth,
  ]);

  return result;
}

/**
 * Clear the badge width measurement cache.
 */
export function clearBadgeWidthCache(): void {
  badgeWidthCache.clear();
}
