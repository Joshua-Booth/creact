import React from "react";
import Faker from "faker";
import { createMemoryHistory } from "history";
import user from "@testing-library/user-event";

// Component
import { default as BackButton } from ".";

// Test Utilities
import { render } from "tests/utils";

describe("BackButton", () => {
  test("should render", () => {
    const label = "Go Back";
    const history = createMemoryHistory({ initialEntries: ["/"] });
    history.goBack = jest.fn();
    const { getByLabelText } = render(
      <BackButton label={label} history={history} />
    );

    const button = getByLabelText(label);
    expect(button).toBeInTheDocument();

    // Test button functionality
    user.click(button);
    expect(history.goBack).toHaveBeenCalledTimes(1);
    history.goBack.mockClear();
  });

  test("should render with no history", () => {
    const label = "Go Back";
    const history = createMemoryHistory({ initialEntries: ["/"] });
    history.goBack = jest.fn();
    window.history.back = jest.fn();
    const { getByLabelText } = render(<BackButton label={label} />);

    const button = getByLabelText(label);
    expect(button).toBeInTheDocument();

    // Test button functionality
    user.click(button);
    expect(history.goBack).not.toHaveBeenCalled();
    expect(window.history.back).toHaveBeenCalledTimes(1);
    history.goBack.mockClear();
    window.history.back.mockClear();
  });

  test("should render with custom route", () => {
    const label = "Go Back";
    const history = createMemoryHistory({ initialEntries: ["/"] });
    history.goBack = jest.fn();
    history.push = jest.fn();
    const route = Faker.lorem.slug();
    const { getByLabelText } = render(
      <BackButton label={label} history={history} route={route} />
    );

    const button = getByLabelText(label);
    expect(button).toBeInTheDocument();

    // Test button functionality
    user.click(button);
    expect(history.goBack).not.toHaveBeenCalled();
    expect(history.push).toHaveBeenCalledTimes(1);
    history.goBack.mockClear();
    history.push.mockClear();
  });

  test("should render with no history and custom route", () => {
    const label = "Go Back";
    const history = createMemoryHistory({ initialEntries: ["/"] });
    history.goBack = jest.fn();
    window.history.pushState = jest.fn();
    const route = Faker.lorem.slug();
    const { getByLabelText } = render(
      <BackButton label={label} route={route} />
    );

    const button = getByLabelText(label);
    expect(button).toBeInTheDocument();

    // Test button functionality
    user.click(button);
    expect(history.goBack).not.toHaveBeenCalled();
    expect(window.history.pushState).toHaveBeenCalledTimes(1);
    history.goBack.mockClear();
    window.history.pushState.mockClear();
  });
});
