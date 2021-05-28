/**
 * Reusable tests as templates for common tests.
 *
 * @file test-templates.js
 * @module test utils - Test templates
 * @author Joshua Booth
 * @see https://github.com/joshua-booth/creact
 */

import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import mockConsole from "jest-mock-console";

import { axe } from "jest-axe";

// Constants
import { APP_TITLE } from "constants/app";

// Utilities
import { userBuilder, errorBuilder } from "./content-builders";
import { renderWithProviderRouter as render } from "./render";

const middleware = [thunk];
const mockStore = configureStore(middleware);

/* eslint-disable jest/no-export */

/**
 * Set up the initial state for the test templates.
 *
 * @function
 * @param {boolean} hasAuth If the component requires authentication state.
 * @param {object} extraState Additional state needed for the component to render
 * @returns {object} - Initial state for the test
 */
const getInitialState = (hasAuth, extraState) => {
  return {
    auth: {
      user: { data: hasAuth ? userBuilder() : {} },
    },
    main: { error: errorBuilder() },
    ...extraState,
  };
};

/**
 * A utility for creating a reusable test template for testing errors on
 * components.
 *
 * @function
 * @param {React.Component} component The component to test an error on
 * @param {string} message A custom test message to display in the console
 * @param {boolean} hasAuth If the component requires authentication
 * @param {object} extraState Additional state for the component to render
 */
export const testError = (component, message, hasAuth, extraState) => {
  // eslint-disable-next-line jest/valid-title
  test(message ? message : "should render error", () => {
    mockConsole();

    const initialState = getInitialState(hasAuth, extraState);

    const { getByTitle } = render(component, {
      providerStore: mockStore(initialState),
    });
    const error = getByTitle("Error");

    expect(error).toBeInTheDocument();
  });
};

/**
 * A utility for creating a reusable test template for testing page titles on
 * page components.
 *
 * @function
 * @param {React.Component} component The component on which to test
 * @param {string} expectedTitle The intended title for the page component
 * @param {boolean} hasAuth If the component requires authentication
 * @param {object} extraState Additional state for the component to render
 */
export const testTitle = (component, expectedTitle, hasAuth, extraState) => {
  test("should render component with page title", () => {
    mockConsole();

    const initialState = getInitialState(hasAuth, extraState);

    render(component, {
      providerStore: mockStore(initialState),
    });

    /* eslint-disable jest/no-conditional-expect */
    if (expectedTitle) {
      expect(document.title).toEqual(expect.stringContaining(expectedTitle));
    } else {
      expect(document.title).toEqual(APP_TITLE);
    }
  });
};

/**
 * Test the accessibility of a component so that it does not contain violations.
 *
 * @function
 * @param {React.Component} component The component to test the accessibility
 * @param {HTMLElement} [element] The parent element to test from
 * @param {string} [name] The name of the test
 * @param {object} extraState Additional state for the component to render
 */
export const testAccessibility = (component, element, name, extraState) => {
  const defaultElement = document.body;
  const defaultTestName = "should have no accessibility violations";

  // eslint-disable-next-line jest/valid-title
  test(name ? name : defaultTestName, async () => {
    mockConsole();
    const initialState = getInitialState(extraState);

    render(component, { providerStore: mockStore(initialState) });

    const results = await axe(element ? element : defaultElement);

    expect(results).toHaveNoViolations();
  });
};
