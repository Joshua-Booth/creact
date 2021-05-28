import React from "react";
import mockConsole from "jest-mock-console";

// Test Utilities
import {
  renderWithProviderRouter as render,
  testAccessibility,
} from "tests/utils";

// Component
import App from ".";

test("should render app", () => {
  mockConsole();
  const { container } = render(<App />);

  expect(container).toBeInTheDocument();
});

testAccessibility(<App />);
