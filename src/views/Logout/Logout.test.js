import React from "react";

// Test Utilities
import {
  renderWithProviderRouter as render,
  testTitle,
  testAccessibility,
} from "tests/utils";

// Component
import Logout from ".";

test("should render logout", () => {
  const { container } = render(<Logout />);

  expect(container).toBeInTheDocument();
});

testTitle(<Logout />, "Logout");

testAccessibility(<Logout />);
