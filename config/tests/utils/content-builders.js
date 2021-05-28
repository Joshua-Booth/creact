/**
 * Content builders for testing.
 *
 * @file content-builders.js
 * @module test utils - Content builders
 * @author Joshua Booth
 * @see https://github.com/joshua-booth/creact
 */

import { build, fake } from "@jackfranklin/test-data-bot";

// Constants
import { ERROR_STATUS_CODES } from "../../../src/constants/statusCodes";

/**
 * Return a random number between and min and max values.
 *
 * @function
 * @param {number} min The lower value to choose from (inclusive).
 * @param {number} max The upper value to choose between (exclusive).
 * @returns {number} - A random number between the min and max values.
 * @example
 * const number = randomNumber(1, 5);
 * // returns either 1, 2, 3 or 4
 */
export function randomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

/**
 * Generator for building users.
 *
 * @function
 * @returns {object} The user object
 * @example
 * // a default random user
 * const user = userBuilder();
 * @example
 * // override specific user attributes
 * const user = userBuilder({
 *  overrides: {
 *    id: 1,
 *    first_name: "John"
 *  }
 * });
 */
export const userBuilder = build("User", {
  fields: {
    id: fake((f) => f.random.uuid()),
    email: fake((f) => f.internet.email()),
    username: fake((f) => f.internet.userName()),
    first_name: fake((f) => f.name.firstName()),
    last_name: fake((f) => f.name.lastName()),
  },
});

/**
 * Generator for building error state.
 *
 * @function
 * @returns {object} error The error object.
 * @returns {string} error.status The status message of the error.
 * @returns {object} error.response The response object of the error.
 * @example
 * // a default error object
 * const error = errorBuilder();
 * @example
 * // override specific error attributes
 * const error = errorBuilder({
 *  overrides: {
 *    status: "Bad Request"
 *  }
 * });
 */
export const errorBuilder = build("Error", {
  fields: {
    status: fake((f) =>
      parseInt(f.random.arrayElement(Object.keys(ERROR_STATUS_CODES)))
    ),
    response: undefined,
  },
  postBuild: (error) => ({
    status: error.status,
    response: { message: ERROR_STATUS_CODES[error.status] },
  }),
});

/**
 * Generator for building errors pages.
 *
 * @function
 * @returns {object} errorPage The page error object.
 * @returns {string} errorPage.status The status message of the error.
 * @returns {object} errorPage.response The response object of the error.
 * @returns {string} errorPage.title The title of the page with the error.
 * @example
 * // a default error object
 * const errorPage = errorPageBuilder();
 * @example
 * // override specific error page attributes
 * const errorPage = errorPageBuilder({
 *  overrides: {
 *    status: "Bad Request",
 *    title: "Dashboard"
 *  }
 * });
 */
export const errorPageBuilder = build("Error Page", {
  fields: {
    status: fake((f) =>
      parseInt(f.random.arrayElement(Object.keys(ERROR_STATUS_CODES)))
    ),
    response: undefined,
    title: undefined,
  },
  postBuild: (error) => ({
    status: error.status,
    response: error.response
      ? error.response
      : { message: ERROR_STATUS_CODES[error.status] },
    title: error.title,
  }),
});

/**
 * Search query generator.
 *
 * @function
 * @returns {object} queryObject The query object.
 * @returns {string} queryObject.query The query value.
 * @example
 * // a default query object
 * const query = queryBuilder();
 * @example
 * // override specific query attributes
 * const query = queryBuilder({
 *  overrides: {
 *    query: "my test query"
 *  }
 * });
 */
export const queryBuilder = build("Query", {
  fields: {
    query: fake((f) => f.lorem.sentence(randomNumber(1, 10))),
  },
});
