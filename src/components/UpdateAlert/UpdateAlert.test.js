import React from "react";
import { render } from "tests/utils";
import user from "@testing-library/user-event";

// Test Utilities
import { testAccessibility } from "tests/utils";

// Component
import UpdateAlert from ".";

test("should render component", () => {
  render(<UpdateAlert />);

  const header = document.querySelector("#updateModalLabel");

  expect(header).toHaveTextContent(/update/i);
});

test("should hide modal", () => {
  render(<UpdateAlert />);
  const header = document.querySelector("#updateModal");

  user.click(header);
  expect(header).toHaveTextContent(/update/i);
});

describe("reload", () => {
  const { reload } = window.location;

  beforeAll(() => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: { reload: jest.fn() },
    });
  });

  afterAll(() => {
    window.location.reload = reload;
  });

  test("should work", () => {
    const { getByTestId } = render(<UpdateAlert />);
    const updateButton = getByTestId("update-button");

    user.click(updateButton);
    expect(window.location.reload).toHaveBeenCalled();
  });
});

testAccessibility(<UpdateAlert />, document.body.firstChild);
