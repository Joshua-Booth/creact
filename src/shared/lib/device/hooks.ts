import * as React from "react";

import { BREAKPOINTS } from "./breakpoints";

/** Device state indicating which device category the viewport falls into */
type DeviceState = {
  /** `true` if viewport is below 768px */
  isMobile: boolean;
  /** `true` if viewport is between 768px and 1023px */
  isTablet: boolean;
  /** `true` if viewport is 1024px or above */
  isDesktop: boolean;
};

function getDeviceState(width: number): DeviceState {
  return {
    isMobile: width < BREAKPOINTS.MOBILE,
    isTablet: width >= BREAKPOINTS.MOBILE && width < BREAKPOINTS.TABLET,
    isDesktop: width >= BREAKPOINTS.TABLET,
  };
}

/**
 * React hook that returns reactive device state based on viewport width.
 * Automatically updates when the viewport crosses breakpoint boundaries.
 * @returns {DeviceState} Object with `isMobile`, `isTablet`, and `isDesktop` booleans
 * @example
 * ```tsx
 * function Component() {
 *   const { isMobile, isDesktop } = useDevice();
 *   return isMobile ? <MobileNav /> : <DesktopNav />;
 * }
 * ```
 */
export function useDevice(): DeviceState {
  const [state, setState] = React.useState<DeviceState>(() =>
    getDeviceState(window.innerWidth)
  );

  React.useEffect(() => {
    const mqlMobile = window.matchMedia(
      `(max-width: ${BREAKPOINTS.MOBILE - 1}px)`
    );
    const mqlTablet = window.matchMedia(
      `(min-width: ${BREAKPOINTS.MOBILE}px) and (max-width: ${BREAKPOINTS.TABLET - 1}px)`
    );

    const onChange = () => {
      setState(getDeviceState(window.innerWidth));
    };

    mqlMobile.addEventListener("change", onChange);
    mqlTablet.addEventListener("change", onChange);

    return () => {
      mqlMobile.removeEventListener("change", onChange);
      mqlTablet.removeEventListener("change", onChange);
    };
  }, []);

  return state;
}
