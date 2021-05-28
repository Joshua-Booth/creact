import ReactGA from "react-ga";

// Load environment variables
require("dotenv").config({
  path: "./config/.env.test",
});

ReactGA.initialize(process.env.GA_TRACKING_ID, { testMode: true });

/**
 * fix: `matchMedia` not present, legacy browsers require a polyfill
 *
 * @returns {object} Empty mappings for window.matchMedia properties
 */
window.matchMedia =
  window.matchMedia ||
  function matchMedia() {
    return {
      matches: () => {},
      addListener: () => {},
      removeListener: () => {},
    };
  };
