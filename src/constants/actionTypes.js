/**
 * Action types for reducers.
 *
 * @file actionTypes.js
 * @module constants - Action types
 * @author Joshua Booth
 * @see https://github.com/joshua-booth/creact
 */

/**
 * All authentication action types.
 *
 * @constant
 * @type {object}
 * @property {string} LOGIN Login action type
 * @property {string} LOGOUT Logout action type
 * @property {string} CHANGE_PASSWORD Change password action type
 * @property {string} USER_PROFILE User profile action type
 * @property {string} USER_PROFILE_REQUESTED User profile requested action type
 * @property {string} USER_PROFILE_FAILURE User profile request failed action type
 */
export const AuthTypes = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  CHANGE_PASSWORD: "CHANGE_PASSWORD",
  USER_PROFILE: "USER_PROFILE",
  USER_PROFILE_REQUESTED: "USER_PROFILE_REQUESTED",
  USER_PROFILE_FAILURE: "USER_PROFILE_FAILURE",
};

/**
 * All application action types.
 *
 * @constant
 * @type {object}
 * @property {string} ERROR Error action type
 * @property {string} REMOVE_ERROR Remove error action type
 * @property {string} PRIVACY_POLICY Privacy policy action type
 * @property {string} TERMS_OF_USE Terms of use action type
 */
export const AppTypes = {
  ERROR: "ERROR",
  REMOVE_ERROR: "REMOVE_ERROR",
  PRIVACY_POLICY: "PRIVACY_POLICY",
  TERMS_OF_USE: "TERMS_OF_USE",
};

/**
 * All core action types.
 *
 * @constant
 * @type {object}
 */
export const CoreTypes = {};
