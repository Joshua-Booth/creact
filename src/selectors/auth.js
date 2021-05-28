/**
 * @module selectors - auth
 */

/**
 * Return the authenticated state of the current user.
 *
 * @constant {boolean}
 * @param {object} state The current state.
 * @example
 * useSelector(getUserToken); // Function component usage
 * getUserToken(state); // Class component usage
 * @returns {boolean} The authenticated state of the user
 */
export const isAuthenticated = (state) => state.auth.authenticated;

/**
 * Return the current token state.
 *
 * @constant {string}
 * @param {object} state The current state.
 * @example
 * useSelector(getUserToken); // Function component usage
 * getUserToken(state); // Class component usage
 * @returns {string} The token
 */
export const getUserToken = (state) => state.auth.token;

/**
 * Return the current user.
 *
 * @constant {object}
 * @param {object} state The current state.
 * @example
 * useSelector(getUser); // Function component usage
 * getUser(state); // Class component usage
 * @returns {object} The user object
 */
export const getUser = (state) => state.auth.user.data;

/**
 * Return the current user loading state.
 *
 * @constant {boolean}
 * @param {object} state The current state.
 * @example
 * useSelector(isLoadingUser); // Function component usage
 * isLoadingUser(state); // Class component usage
 * @returns {boolean} The user loading state
 */
export const isLoadingUser = (state) => state.auth.user.loading;
