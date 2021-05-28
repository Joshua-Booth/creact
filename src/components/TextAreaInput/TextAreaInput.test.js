import React from "react";
import Faker from "faker";
import mockConsole from "jest-mock-console";

// Component
import TextAreaInput from ".";

// Test Utilities
import { render } from "tests/utils";

describe("TextAreaInput", () => {
  beforeEach(() => {
    mockConsole();
  });

  test("should render", () => {
    render(<TextAreaInput innerRef={() => {}} />);

    const input = document.querySelector("textarea");

    expect(input).toBeInTheDocument();
  });

  test("should render with an id", () => {
    const id = Faker.lorem.word();
    const { getByTestId } = render(
      <TextAreaInput id={id} innerRef={() => {}} />
    );

    const input = getByTestId(id);

    expect(input).toBeInTheDocument();
  });

  test("should render with name", () => {
    const name = Faker.lorem.word();
    render(<TextAreaInput name={name} innerRef={() => {}} />);

    const input = document.querySelector("textarea");

    expect(input).toBeInTheDocument();
  });

  test("should render with an error", () => {
    const error = { message: Faker.lorem.word() };
    const { getByText } = render(
      <TextAreaInput error={error} innerRef={() => {}} />
    );

    const input = document.querySelector("textarea");
    const errorMessage = getByText(error.message);

    expect(input).toBeInTheDocument();
    expect(errorMessage).toBeInTheDocument();
  });

  test("should render with a submit error", () => {
    const error = Faker.lorem.word();
    const { getByText } = render(
      <TextAreaInput submitError={error} innerRef={() => {}} />
    );

    const input = document.querySelector("textarea");
    const errorMessage = getByText(error);

    expect(input).toBeInTheDocument();
    expect(errorMessage).toBeInTheDocument();
  });
});
