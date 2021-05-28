/**
 * Action utilities.
 *
 * @file index.js
 * @module utils - Action
 * @author Joshua Booth
 * @see https://github.com/joshua-booth/creact
 */

import store from "store";

// Selectors
import { getUserToken } from "selectors/auth";

/**
 * Auth utility for request authentication.
 *
 * @function
 * @returns {object} auth - Token authentication object with user token from store
 */
export const auth = () => ({
  authorization: "Token " + getUserToken(store.getState()),
});
