import React from "react";
import mockConsole from "jest-mock-console";

// Test Utilities
import {
  renderWithRouter as render,
  testError,
  testTitle,
  testAccessibility,
} from "tests/utils";

// Component
import NoMatch from ".";

test("should render component", () => {
  mockConsole();

  render(<NoMatch />);

  const header = document.querySelector("h1");

  expect(header).toHaveTextContent(/page not found/i);
});

testError(<NoMatch />);

testTitle(<NoMatch />, "Not Found");

testAccessibility(<NoMatch />);
