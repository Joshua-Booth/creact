import React from "react";

// Test Utilities
import { render, testTitle, testAccessibility } from "tests/utils";

// Component
import Landing from ".";

test("should render landing", () => {
  const { container } = render(<Landing />);

  expect(container).toBeInTheDocument();
});

testTitle(<Landing />);

testAccessibility(<Landing />);
