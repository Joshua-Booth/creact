import thunk from "redux-thunk";

import { createStore, applyMiddleware, compose } from "redux";
import { createLogger } from "redux-logger";

// Reducer
import rootReducer from "reducers";

/**
 * Sets up a Redux store with middleware, reducers and initial state.
 *
 * @param {object} initialState Starting state for the Redux store
 * @returns {object} The store
 */
const configureStore = (initialState) => {
  let middleware = [thunk];
  let composer = compose;

  const env = process.env.NODE_ENV;

  if (env === "development") {
    const logger = createLogger();
    middleware = [...middleware, logger];

    const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    composer = reduxDevTools || compose;

    console.info(reduxDevTools ? "Using Redux Dev Tools Extension" : null);
  }

  middleware = applyMiddleware(...middleware);

  const store = createStore(rootReducer, initialState, composer(middleware));
  return store;
};

export default configureStore();
