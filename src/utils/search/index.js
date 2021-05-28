/**
 * Search utilities.
 *
 * @file index.js
 * @module utils - Search
 * @author Joshua Booth
 * @see https://github.com/joshua-booth/creact
 */

import qs from "qs";
import algoliasearch from "algoliasearch/lite";

// Constants
import { ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY } from "constants/env";

export const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);

/* istanbul ignore next */
export const ENV = process.env.NODE_ENV == "production" ? "prod" : "dev";

export const DEBOUNCE_TIME = 700;

export const createURL = (state, path = "search") => {
  const isDefaultRoute = !state.query && state.page === 1;

  if (isDefaultRoute) {
    return "";
  }

  const queryParameters = {};

  if (state.query) {
    queryParameters.query = encodeURIComponent(state.query);
  }
  /* istanbul ignore else */
  if (state.page !== 1) {
    queryParameters.page = state.page;
  }

  const queryString = qs.stringify(queryParameters, {
    addQueryPrefix: true,
    arrayFormat: "repeat",
  });

  return `/${path}${queryString}`;
};

export const searchStateToUrl = (searchState, path) =>
  searchState ? createURL(searchState, path) : "";

export const urlToSearchState = (location) => {
  const { query = "", page = 1 } = qs.parse(location.search.slice(1));

  return {
    query: decodeURIComponent(query),
    page,
  };
};
