import { AppTypes } from "constants/actionTypes";

/**
 * Reducer for the main app state.
 *
 * @function
 * @param {object} state The current data state
 * @param {object} action The action to update the state
 * @returns {object} Default or new updated state
 */
export default function (state = {}, action) {
  switch (action.type) {
    case AppTypes.ERROR:
      return { ...state, error: action.payload };
    case AppTypes.REMOVE_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
}
