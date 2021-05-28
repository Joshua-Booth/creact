import React from "react";

// Test Utilities
import {
  renderWithProviderRouter as render,
  testAccessibility,
} from "tests/utils";

// Component
import BottomNavigation from ".";

test("should render bottom navigation component", () => {
  const { container } = render(<BottomNavigation />);

  expect(container).toBeInTheDocument();
});

testAccessibility(<BottomNavigation />);
