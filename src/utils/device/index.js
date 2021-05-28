/**
 * Device utilities.
 *
 * @file index.js
 * @module utils - Device
 * @author Joshua Booth
 * @see https://github.com/joshua-booth/creact
 */

// Constants
import { MAX_MOBILE_SIZE, MAX_TABLET_LARGE_SIZE } from "constants/screenSize";

/**
 * Determines if the screen width is of a mobile device size.
 *
 * @param {number} screenWidth The current screen width
 * @returns {boolean} If the screen width is a mobile device size
 */
export const isMobile = (screenWidth) => screenWidth <= MAX_TABLET_LARGE_SIZE;

/**
 * Determines if the screen width is of a desktop size.
 *
 * @param {number} screenWidth The current screen width
 * @returns {boolean} If the screen width is desktop size
 */
export const isDesktop = (screenWidth) => screenWidth > MAX_TABLET_LARGE_SIZE;

/**
 * Determines if the screen width is only a tablet size.
 *
 * @param {number} screenWidth The current screen width
 * @returns {boolean} If the screen width is only a tablet size
 */
export const isTabletOnly = (screenWidth) =>
  screenWidth > MAX_MOBILE_SIZE && screenWidth <= MAX_TABLET_LARGE_SIZE;

// Credit: https://stackoverflow.com/a/52695341/11324006
/**
 * Determines if the screen's display mode is in standalone mode.
 *
 * @see https://stackoverflow.com/a/52695341/11324006
 * @returns {boolean} If the window is in standalone mode
 */
/* istanbul ignore next */
export const isInStandaloneMode = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone;

// Credit: https://stackoverflow.com/a/9039885/11324006
/**
 * Determines If the device running on a iOS/iPadOS/macOS platform.
 * Use this single function for all Apple platforms.
 *
 * @see https://stackoverflow.com/a/9039885/11324006
 * @returns {boolean} If the device running on a iOS/iPadOS/macOS platform
 */
/* istanbul ignore next */
export const isiOS = () => {
  return (
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
};
