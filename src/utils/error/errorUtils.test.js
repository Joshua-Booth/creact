import React from "react";
import Faker from "faker";

// Constants
import { AppTypes } from "constants/actionTypes";
import { HTTP_STATUS_CODES } from "constants/statusCodes";

// Test Utilities
import { render, mockStore } from "tests/utils";

// Utilities
import {
  resetErrorState,
  isObjectEmpty,
  showAllErrors,
  hideAllErrors,
} from ".";

const initialState = {};
let store = mockStore(initialState);

describe("Error Utilities", () => {
  test("should dispatch an action to reset the error state", async () => {
    const expectedActions = [{ type: AppTypes.REMOVE_ERROR }];

    // Initialize mockstore with an error
    const initialState = {
      error: {
        status: parseInt(
          Faker.random.arrayElement(Object.keys(HTTP_STATUS_CODES))
        ),
      },
    };
    store = mockStore(initialState);

    // Dispatch the action
    store.dispatch(resetErrorState());

    expect(store.getActions()).toEqual(expectedActions);
    store = mockStore();
  });

  test("should object should be empty", () => {
    expect(isObjectEmpty({})).toBe(true);
    expect(isObjectEmpty({ object: "test" })).toBe(false);
  });

  test("should hide all errors", () => {
    for (let i = 0; i < 3; i++) {
      render(<div className="submit-error-message" />);
    }

    hideAllErrors();

    const submitError = document.querySelector(".submit-error-message");
    expect(submitError).toHaveClass("d-none");
  });

  test("should show all errors", () => {
    const showAllErrorsMock = jest.fn(showAllErrors);
    for (let i = 0; i < 3; i++) {
      render(<div className="submit-error-message" />);
    }

    const status = Faker.random.arrayElement(Object.keys(HTTP_STATUS_CODES));
    const error = {
      status: status,
      statusText: HTTP_STATUS_CODES[status],
    };
    showAllErrorsMock(error);

    const submitError = document.querySelector(".submit-error-message");
    expect(submitError).not.toHaveClass("d-none");
    expect(submitError).toHaveClass("d-block");

    showAllErrorsMock();
    expect(showAllErrorsMock).toHaveBeenCalledTimes(2);
  });
});
