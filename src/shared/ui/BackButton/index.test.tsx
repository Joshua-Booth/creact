import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";
import BackButton from "./index";

const mockNavigate = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("BackButton component", () => {
  it("should render with default text", () => {
    render(
      <BrowserRouter>
        <BackButton />
      </BrowserRouter>
    );
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  it("should call navigate(-1) when clicked", async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <BackButton />
      </BrowserRouter>
    );

    const button = screen.getByRole("button", { name: "Back" });
    await user.click(button);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("should apply custom className when provided", () => {
    const customClass = "custom-back-button";
    render(
      <BrowserRouter>
        <BackButton className={customClass} />
      </BrowserRouter>
    );

    const button = screen.getByRole("button", { name: "Back" });
    expect(button).toHaveClass(customClass);
  });

  it("should render as a button element", () => {
    render(
      <BrowserRouter>
        <BackButton />
      </BrowserRouter>
    );

    const button = screen.getByRole("button", { name: "Back" });
    expect(button.tagName).toBe("BUTTON");
  });

  it("should not have className when not provided", () => {
    render(
      <BrowserRouter>
        <BackButton />
      </BrowserRouter>
    );

    const button = screen.getByRole("button", { name: "Back" });
    expect(button.className).toBe("");
  });
});
