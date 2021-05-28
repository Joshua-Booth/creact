// Test Utilities
import { userBuilder, errorBuilder } from "tests/utils";

// Reducer
import reducer, { DEFAULT_STATE } from "reducers/auth";

// Action Types
import { AuthTypes } from "constants/actionTypes";

describe("authenticate reducer", () => {
  test("returns the initial state", () => {
    expect(reducer(undefined, {})).toEqual(DEFAULT_STATE);
  });

  test("handles login request", () => {
    expect(
      reducer(DEFAULT_STATE, { type: AuthTypes.LOGIN, payload: "test-token" })
    ).toEqual({
      ...DEFAULT_STATE,
      authenticated: true,
      token: "test-token",
    });
  });

  test("handles logout", () => {
    expect(reducer(DEFAULT_STATE, { type: AuthTypes.LOGOUT })).toEqual({
      ...DEFAULT_STATE,
      authenticated: false,
      token: null,
    });
  });

  test("handles user profile request", () => {
    expect(
      reducer(DEFAULT_STATE, { type: AuthTypes.USER_PROFILE_REQUESTED })
    ).toEqual({
      ...DEFAULT_STATE,
      user: {
        ...DEFAULT_STATE.user,
        loading: true,
        error: null,
      },
    });
  });

  test("handles user profile success", () => {
    const user = userBuilder();
    expect(
      reducer(DEFAULT_STATE, {
        type: AuthTypes.USER_PROFILE,
        payload: user,
      })
    ).toEqual({
      ...DEFAULT_STATE,
      user: {
        data: user,
        loading: false,
        error: null,
      },
    });
  });

  test("handles user profile failure", () => {
    const error = errorBuilder();
    expect(
      reducer(DEFAULT_STATE, {
        type: AuthTypes.USER_PROFILE_FAILURE,
        payload: error,
      })
    ).toEqual({
      ...DEFAULT_STATE,
      user: {
        ...DEFAULT_STATE.user,
        loading: false,
        error: error,
      },
    });
  });
});
