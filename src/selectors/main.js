/**
 * @module selectors - main
 */

/**
 * Return the current error state.
 *
 * @constant {object}
 * @param {object} state The current state.
 * @example
 * dispatch(getErrorState()); // Function component usage
 * @example
 * this.props.getErrorState(); // Class component usage
 * @returns {?object} The current error state
 */
export const getError = (state) => state.main.error;
