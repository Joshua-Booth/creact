import React from "react";

// Test Utilities
import {
  renderWithProviderRouter as render,
  mockStore,
  testError,
  testTitle,
  testAccessibility,
  userBuilder,
} from "tests/utils";

// Component
import Dashboard from ".";

// Constants
import { DEFAULT_STATE } from "reducers/core";

const CORE_STATE = {
  core: {
    ...DEFAULT_STATE,
  },
};

const TEST_STATE = {
  auth: {
    user: {},
  },
  ...CORE_STATE,
  main: { error: {} },
};

describe("Dashboard", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("renders with component container", async () => {
    const state = TEST_STATE;
    state.auth.user.data = userBuilder();

    render(<Dashboard />, {
      providerStore: mockStore(state),
    });

    const container = document.querySelector(".component-container");
    expect(container).toBeInTheDocument();
  });

  testError(<Dashboard />, null, true, CORE_STATE);

  testTitle(<Dashboard />, "Dashboard", true, CORE_STATE);

  test("renders with loader", async () => {
    const state = TEST_STATE;
    state.auth.user = { data: {}, loading: true };

    render(<Dashboard />, {
      providerStore: mockStore(state),
    });

    const loader = document.querySelector(".loader");
    expect(loader).toBeInTheDocument();
  });

  test("renders loader with no user", async () => {
    const state = TEST_STATE;
    state.auth.user.data = {};
    state.main.error = null;

    render(<Dashboard />, {
      providerStore: mockStore(state),
    });

    const loader = document.querySelector(".loader");
    expect(loader).toBeInTheDocument();
  });

  const ACCESSIBILITY_STATE = TEST_STATE;
  ACCESSIBILITY_STATE.auth.user.data = userBuilder();
  testAccessibility(
    <Dashboard />,
    document.body,
    undefined,
    ACCESSIBILITY_STATE
  );
});
