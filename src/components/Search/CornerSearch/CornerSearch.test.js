import React from "react";

// Test Utilities
import { renderWithProviderRouter as render } from "tests/utils";

// Component
import CornerSearch from ".";

test("should render corner search component", () => {
  const { container } = render(<CornerSearch />);

  expect(container).toBeInTheDocument();
});
