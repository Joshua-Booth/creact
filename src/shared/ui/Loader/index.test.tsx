import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Loader from "./index";

describe("Loader component", () => {
  it("should render without crashing", () => {
    render(<Loader />);
    const loader = screen.getByRole("region");
    expect(loader).toBeInTheDocument();
  });

  it("should have the correct title attribute", () => {
    render(<Loader />);
    const loader = screen.getByTitle("Loader");
    expect(loader).toBeInTheDocument();
  });

  it("should have the correct role", () => {
    render(<Loader />);
    const loader = screen.getByRole("region");
    expect(loader).toBeInTheDocument();
  });

  it("should render with loader class", () => {
    render(<Loader />);
    const loader = screen.getByRole("region");
    expect(loader).toHaveClass("loader");
  });

  it("should render a spinner element", () => {
    render(<Loader />);
    const loader = screen.getByRole("region");
    const spinner = loader.querySelector(".spinner");
    expect(spinner).toBeInTheDocument();
  });

  it("should have correct spinner styles", () => {
    render(<Loader />);
    const loader = screen.getByRole("region");
    const spinner = loader.querySelector(".spinner") as HTMLElement;

    expect(spinner?.style.width).toBe("100px");
    expect(spinner?.style.height).toBe("100px");
    expect(spinner?.style.borderRadius).toBe("50%");
  });
});
