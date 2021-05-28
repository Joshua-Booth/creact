// Test Utilities
import { errorBuilder } from "tests/utils";

// Reducer
import reducer from "reducers/main";

// Action Types
import { AppTypes } from "constants/actionTypes";

const DEFAULT_STATE = {};

describe("main reducer", () => {
  test("returns the initial state", () => {
    expect(reducer(undefined, DEFAULT_STATE)).toEqual({});
  });

  test("handles error", () => {
    const error = errorBuilder();

    expect(
      reducer(DEFAULT_STATE, { type: AppTypes.ERROR, payload: error })
    ).toEqual({
      ...DEFAULT_STATE,
      error: error,
    });
  });

  test("handles remove error", () => {
    const STATE = { error: errorBuilder() };

    expect(reducer(STATE, { type: AppTypes.REMOVE_ERROR })).toEqual({
      ...DEFAULT_STATE,
      error: null,
    });
  });
});
