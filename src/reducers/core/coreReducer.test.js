// Reducer
import reducer, { DEFAULT_STATE } from "reducers/core";

// Action Types
import { CoreTypes } from "constants/actionTypes"; // eslint-disable-line

describe("core reducer", () => {
  test("returns the initial state", () => {
    expect(reducer(undefined, {})).toEqual(DEFAULT_STATE);
  });
});
