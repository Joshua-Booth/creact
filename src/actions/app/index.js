/**
 * App actions.
 *
 * @file index.js
 * @module actions - App
 * @author Joshua Booth
 * @see https://github.com/joshua-booth/creact
 */

import axios from "axios"; // eslint-disable-line

// Action Creators
import * as Action from "./creators";

// Constants
import { AppUrls } from "constants/urls"; // eslint-disable-line

// Utilities
import { auth } from "utils/action"; // eslint-disable-line

/**
 * Dispatches an error.
 *
 * @param {Function} dispatch The function for dispatching
 * @param {object} error The error object
 * @param {object} [error.response] The full response of the error
 * @param {number} [error.response.status] The status code of the error
 * @example
 * // Dispatch a 404 error.
 * const error = {
 *    response: {
 *      status: 404,
 *      statusText: "Not Found",
 *      ...
 *    }
 * };
 * dispatchError(dispatch, error));
 */
export function dispatchError(dispatch, error) {
  let payload = null;
  if (error) {
    if (error.response) {
      payload = {
        status: error.response.status,
        response: error.response,
      };
    } else {
      payload = {
        status: 500,
        response: error,
      };
    }
  }
  dispatch(Action.fetchError(payload));
}
