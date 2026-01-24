import { BREAKPOINTS } from "./breakpoints";

/**
 * Checks if the current viewport is mobile-sized (< 768px).
 *
 * @returns `true` if window width is below the mobile breakpoint
 */
export const isMobile = (): boolean => {
  return window.innerWidth < BREAKPOINTS.MOBILE;
};

/**
 * Checks if the current viewport is tablet-sized (768px - 1023px).
 *
 * @returns `true` if window width is between mobile and tablet breakpoints
 */
export const isTablet = (): boolean => {
  return (
    window.innerWidth >= BREAKPOINTS.MOBILE &&
    window.innerWidth < BREAKPOINTS.TABLET
  );
};

/**
 * Checks if the current viewport is desktop-sized (>= 1024px).
 *
 * @returns `true` if window width is at or above the tablet breakpoint
 */
export const isDesktop = (): boolean => {
  return window.innerWidth >= BREAKPOINTS.TABLET;
};
