/**
 * Responsive breakpoint values in pixels.
 *
 * - Below `MOBILE`: mobile devices
 * - Between `MOBILE` and `TABLET`: tablet devices
 * - At or above `TABLET`: desktop devices
 */
export const BREAKPOINTS = {
  /** Breakpoint between mobile and tablet (768px) */
  MOBILE: 768,
  /** Breakpoint between tablet and desktop (1024px) */
  TABLET: 1024,
} as const;
