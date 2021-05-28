import React from "react";

// Component
import Loader from ".";

// Test Utilities
import { render } from "tests/utils";

describe("Loader", () => {
  test("should render", () => {
    render(<Loader />);

    const loader = document.querySelector(".loader");

    expect(loader).toBeInTheDocument();
  });
});
