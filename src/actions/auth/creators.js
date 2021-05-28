/**
 * Authentication action creators.
 *
 * @file creators.js
 * @module action creators - Authentication
 * @author Joshua Booth
 * @see https://github.com/joshua-booth/creact
 */

// Constants
import { AuthTypes } from "constants/actionTypes";

/**
 * Updates state with login information.
 *
 * @param {string} token User token for authentication
 * @example
 * // Update the login state only if the login response is successful.
 * const token = response.data.key;
 * dispatch(authLogin(token));
 * @returns {object} LOGIN type for dispatching
 */
export const authLogin = (token) => ({
  type: AuthTypes.LOGIN,
  payload: token,
});

/**
 * Updates state with logout information.
 * Also removes the auth token from local storage.
 *
 * @example
 * // Update the login state to logout the user.
 * dispatch(logoutUser());
 * @returns {object} LOGOUT type for dispatching
 */
export const logoutUserSuccess = {
  type: AuthTypes.LOGOUT,
};

/**
 * Updates the user state with new state about the request for the user.
 *
 * @param {object} payload The user object
 * @example
 * // Update the user state.
 * dispatch(fetchUserProfileRequest(user));
 * @returns {object} USER_PROFILE_REQUESTED type for dispatching
 */
export const fetchUserProfileRequest = {
  type: AuthTypes.USER_PROFILE_REQUESTED,
};

/**
 * Updates the user state with the current user.
 *
 * @param {object} payload The user object
 * @example
 * // Update the user state with the current user.
 * dispatch(fetchUserProfileSuccess(user));
 * @returns {object} USER_PROFILE type for dispatching
 */
export const fetchUserProfileSuccess = (payload) => ({
  type: AuthTypes.USER_PROFILE,
  payload: payload,
});

/**
 * Updates the user state with an error.
 *
 * @param {object} error The error payload
 * @example
 * // Update the user state with an error.
 * dispatch(fetchUserProfileFailed(error));
 * @returns {object} USER_PROFILE_FAILURE type for dispatching
 */
export const fetchUserProfileFailed = (error) => ({
  type: AuthTypes.USER_PROFILE_FAILURE,
  payload: error,
});
