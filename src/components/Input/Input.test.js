import React from "react";
import Faker from "faker";
import mockConsole from "jest-mock-console";

// Component
import Input from ".";

// Test Utilities
import { render } from "tests/utils";

describe("Input", () => {
  beforeEach(() => {
    mockConsole();
  });

  test("should render", () => {
    render(<Input innerRef={() => {}} />);

    const input = document.querySelector("input");

    expect(input).toBeInTheDocument();
  });

  test("should render with an id", () => {
    const id = Faker.lorem.word();
    const { getByTestId } = render(<Input id={id} innerRef={() => {}} />);

    const input = getByTestId(id);

    expect(input).toBeInTheDocument();
  });

  test("should render with name", () => {
    const name = Faker.lorem.word();
    render(<Input name={name} innerRef={() => {}} />);

    const input = document.querySelector("input");

    expect(input).toBeInTheDocument();
  });

  test("should render with an error", () => {
    const error = { message: Faker.lorem.word() };
    const { getByText } = render(<Input error={error} innerRef={() => {}} />);

    const input = document.querySelector("input");
    const errorMessage = getByText(error.message);

    expect(input).toBeInTheDocument();
    expect(errorMessage).toBeInTheDocument();
  });

  test("should render with a submit error", () => {
    const error = Faker.lorem.word();
    const { getByText } = render(
      <Input submitError={error} innerRef={() => {}} />
    );

    const input = document.querySelector("input");
    const errorMessage = getByText(error);

    expect(input).toBeInTheDocument();
    expect(errorMessage).toBeInTheDocument();
  });
});
