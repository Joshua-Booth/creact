/**
 * Page utilities.
 *
 * @file index.js
 * @module utils - Page
 * @author Joshua Booth
 * @see https://github.com/joshua-booth/creact
 */

import ReactGA from "react-ga";

import { APP_TITLE } from "constants/app";

/**
 * Set the page title with a predefined format.
 *
 * @param {string} [title=`${APP_TITLE}`] The new page title
 */
export const setPageTitle = (title) => {
  if (title) {
    document.title = `${title} | ${APP_TITLE}`;
  } else {
    document.title = APP_TITLE;
  }
};

/**
 * Event - Add custom tracking event.
 *
 * @param {string} category Top level event category
 * @param {string} action Description of the behaviour the user took
 * @param {string} label More precise label to provide more detail on the event
 */
export const Event = (category, action, label) => {
  ReactGA.event({
    category: category,
    action: action,
    label: label,
  });
};

/** Re-export react-ga OutboundLink so that it can be used from this file. */
export const OutboundLink = ReactGA.OutboundLink;
