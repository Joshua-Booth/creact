import React from "react";
import Faker from "faker";
import user from "@testing-library/user-event";
import mockConsole from "jest-mock-console";

// Test Utilities
import { render, errorPageBuilder as errorBuilder } from "tests/utils";

// Component
import Error from "components/Error";

// Constants
import { HTTP_STATUS_CODES } from "constants/statusCodes";

let props;

// All tests for a rendered Error.
describe("render error", () => {
  beforeEach(() => {
    props = errorBuilder();
    console.debug = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("error with status and response and statusText", () => {
    const { getByTestId } = render(<Error {...props} />);
    const statusText = getByTestId("status-text");

    expect(statusText).toHaveTextContent(HTTP_STATUS_CODES[props.status]);
  });

  test("error with status", () => {
    mockConsole();
    props = {
      status: 404,
    };

    const { getByTestId } = render(<Error {...props} />);
    const statusText = getByTestId("status-text");

    expect(statusText).toHaveTextContent(HTTP_STATUS_CODES[props.status]);
  });

  test("error with status and empty response", () => {
    mockConsole();
    props = errorBuilder({
      overrides: { response: {} },
    });

    const { getByTestId } = render(<Error {...props} />);
    const statusText = getByTestId("status-text");
    expect(statusText).toHaveTextContent(HTTP_STATUS_CODES[props.status]);
  });

  test("error with status and response with statusText", () => {
    const status = Faker.random.arrayElement(Object.keys(HTTP_STATUS_CODES));
    props = {
      status: parseInt(status),
      response: { statusText: HTTP_STATUS_CODES[status] },
    };

    const { getByTestId } = render(<Error {...props} />);
    const statusText = getByTestId("status-text");
    expect(statusText).toHaveTextContent(HTTP_STATUS_CODES[props.status]);
  });

  test("error with status 500 and response with error", () => {
    props = errorBuilder({
      overrides: {
        status: 500,
        response: { message: "Network Error" },
      },
    });

    const { getByTestId } = render(<Error {...props} />);
    const statusText = getByTestId("status-text");
    expect(statusText).toHaveTextContent("Network Error");
  });

  test("error with status below 400", () => {
    mockConsole();
    const statusCode = 200;
    props = errorBuilder({
      overrides: { status: statusCode, response: {} },
    });

    const { getByTestId } = render(<Error {...props} />);
    const statusText = getByTestId("status-code");
    expect(statusText).toHaveTextContent(statusCode);
  });

  test("error with status, response and title", () => {
    props = errorBuilder({
      overrides: { title: "Dashboard" },
    });

    const { getByText } = render(<Error {...props} />);
    const statusText = getByText(/dashboard/i);
    expect(statusText).toHaveTextContent("Dashboard");
  });

  test("error with no args", () => {
    mockConsole();
    const { queryByTestId } = render(<Error />);
    const error = queryByTestId("error");

    expect(error).not.toBeInTheDocument();
  });

  test("should go back with button", () => {
    const history = window.history;
    delete window.history;
    window.history = {
      ...history,
      back: jest.fn(),
    };

    const { getByLabelText } = render(<Error {...props} />);
    const button = getByLabelText(/go back/i);
    user.click(button);

    expect(window.history.back).toHaveBeenCalledTimes(1);
    jest.restoreAllMocks();
    window.location = location;
  });

  test("should reload page with button", () => {
    const location = window.location;
    delete window.location;
    window.location = {
      ...location,
      reload: jest.fn(),
    };

    const { getByLabelText } = render(<Error {...props} />);
    const button = getByLabelText(/reload page/i);
    user.click(button);

    expect(window.location.reload).toHaveBeenCalledTimes(1);
    jest.restoreAllMocks();
    window.location = location;
  });
});
