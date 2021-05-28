import { AuthTypes } from "constants/actionTypes";

export const DEFAULT_STATE = {
  user: {
    loading: false,
    error: null,
    data: {},
  },
};

/**
 * Reducer for all the authentication related state.
 *
 * @function
 * @param {object} state The current data state
 * @param {object} action The action to update the state
 * @returns {object} Default or new updated state
 */
export default function (state = DEFAULT_STATE, action) {
  switch (action.type) {
    case AuthTypes.LOGIN:
      return { ...state, authenticated: true, token: action.payload };
    case AuthTypes.LOGOUT:
      return { ...state, authenticated: false, token: null };
    case AuthTypes.USER_PROFILE:
      return {
        ...state,
        user: { data: action.payload, loading: false, error: null },
      };
    case AuthTypes.USER_PROFILE_REQUESTED:
      return { ...state, user: { ...state.user, loading: true, error: null } };
    case AuthTypes.USER_PROFILE_FAILURE:
      return {
        ...state,
        user: { ...state.user, loading: false, error: action.payload },
      };
    default:
      return state;
  }
}
