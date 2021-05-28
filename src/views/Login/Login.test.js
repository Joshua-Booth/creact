import React from "react";
import { axe } from "jest-axe";
import Faker from "faker";
import user from "@testing-library/user-event";
import mockConsole from "jest-mock-console";

import {
  renderWithProviderRouter as render,
  mockStore,
  testError,
  testTitle,
} from "tests/utils";

// Component
import Login from ".";

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
});

test("should render login", () => {
  const { container } = render(<Login />);

  expect(container).toBeInTheDocument();
});

test.todo("should redirect to dashboard with authenticated state");

testError(<Login />);

testTitle(<Login />, "Login");

test("should render with 400 error state", () => {
  mockConsole();
  const state = {
    auth: {},
    main: { error: { status: 400 } },
  };
  const store = mockStore(state);
  render(<Login />, {
    providerStore: store,
  });

  const errorStatus = document.querySelector("#status-text");
  expect(errorStatus).not.toBeInTheDocument();

  const incorrectLogin = document.querySelector(".submit-error-message");
  expect(incorrectLogin).toHaveTextContent("Email or password is incorrect!");
});

test("should hide errors on field change", () => {
  mockConsole();
  const store = mockStore({
    auth: {},
    main: { error: { status: 400 } },
  });

  const { getByLabelText } = render(<Login />, {
    providerStore: store,
  });

  const error = document.querySelector(".submit-error-message");
  expect(error).toBeInTheDocument();

  const emailField = getByLabelText(/email/i);
  user.type(emailField, Faker.internet.email());

  const errorContainer = document.querySelector(".submit-error-message");
  expect(errorContainer).toHaveClass("d-none");
});

test("should have no accessibility violations", async () => {
  const store = mockStore({
    auth: {},
    main: { error: {} },
  });

  render(<Login />, {
    providerStore: store,
  });

  const results = await axe(document.body);
  expect(results).toHaveNoViolations();
});
