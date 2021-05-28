/**
 * Custom renderers for testing React components.
 *
 * @file render.js
 * @module test utils - Render
 * @author Joshua Booth
 * @see https://github.com/joshua-booth/creact
 */

import React from "react";
import PropTypes from "prop-types";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

import { render } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";

import store from "store";

const middleware = [thunk];

/**
 * A mocked store for testing components that use Redux.
 *
 * @constant
 * @type {Function}
 */
export const mockStore = configureStore(middleware);

/**
 * Render a component only wrapped with a react-redux provider for testing.
 *
 * @param {React.Component} ui The component to render
 * @param {...object} options Additional options for the component to render
 * @returns {HTMLElement} The ui element to test
 */
export function renderWithProvider(ui, { ...options }) {
  const Wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  Wrapper.propTypes = {
    /** The children nodes to be wrapped. */
    children: PropTypes.node,
  };

  return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * Render a component only wrapped with a router for testing.
 *
 * @param {React.Component} ui The component to render
 * @param {...object} options Additional options for the component to render
 * @param {string} [options.route] Initial route of the test router
 * @param {string} [options.history] Initial history state of the component
 * @returns {HTMLElement} The ui element to test
 */
export function renderWithRouter(
  ui,
  {
    route = "/",
    history = createMemoryHistory({ initialEntries: [route] }),
  } = {}
) {
  const Wrapper = ({ children }) => (
    <Router history={history}>{children}</Router>
  );
  Wrapper.propTypes = {
    /** The children nodes to be wrapped. */
    children: PropTypes.node,
  };

  return { ...render(ui, { wrapper: Wrapper }), history };
}

/**
 * Render a component wrapped with a router and react-redux provider for
 * testing.
 *
 * @param {React.Component} ui The component to render
 * @param {...object} options Additional options for the component to render
 * @param {string} [options.route] Initial route of the test router
 * @param {string} [options.history] Initial history state of the component
 * @param {object} [options.providerStore] Initial store for the component
 * @returns {HTMLElement} The ui element to test
 */
export function renderWithProviderRouter(
  ui,
  {
    route = "/",
    history = createMemoryHistory({ initialEntries: [route] }),
    providerStore = store,
  } = {}
) {
  const Wrapper = ({ children }) => {
    return (
      <Provider store={providerStore}>
        <Router history={history}>{children}</Router>
      </Provider>
    );
  };
  Wrapper.propTypes = {
    /** The children nodes to be wrapped. */
    children: PropTypes.node,
  };

  return { ...render(ui, { wrapper: Wrapper }), history };
}
