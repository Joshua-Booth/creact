/**
 * Action types for reducers.
 *
 * @file env.js
 * @module constants - Environment variables
 * @author Joshua Booth
 * @see https://github.com/joshua-booth/creact
 */

// Algolia
export const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
export const ALGOLIA_SEARCH_KEY = process.env.ALGOLIA_SEARCH_KEY;

// Google Analytics
export const GOOGLE_ANALYTICS_ID = process.env.REACT_APP_GA_TRACKING_ID;

// Hotjar
export const HOTJAR_TRACKING_ID = process.env.REACT_APP_HOTJAR_TRACKING_ID;
export const HOTJAR_SNIPPET_VERSION =
  process.env.REACT_APP_HOTJAR_SNIPPET_VERSION;

// Intercom
export const INTERCOM_APP_ID = process.env.REACT_APP_INTERCOM_APP_ID;

// Sentry
export const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN;
