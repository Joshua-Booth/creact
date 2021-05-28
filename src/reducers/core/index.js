/** Import the core types when your app state is set up */
import { CoreTypes } from "constants/actionTypes"; // eslint-disable-line

// eslint-disable-next-line
const INITIAL_STATE = {
  loading: false,
  error: null,
  data: {},
};

export const DEFAULT_STATE = {};

/**
 * Reducer for all the core app logic state.
 *
 * @function
 * @param {object} state The current data state
 * @param {object} action The action to update the state
 * @returns {object} Default or new updated state
 */
export default function (state = DEFAULT_STATE, action) {
  switch (action.type) {
    default:
      return state;
  }
}
