// Global styles
import "bootstrap/dist/css/bootstrap.css";
import "redux-notifications/lib/styles.css";
import "./styles/main.scss";

// MUST BE IMPORTED **BEFORE** React
import "utils/dev/react-devtools-hook";

import React from "react";
import ReactDOM from "react-dom";
import ReactGA from "react-ga";

import { BrowserRouter as Router } from "react-router-dom";
import { hotjar } from "react-hotjar";
import { Integrations } from "@sentry/tracing";
import { IntercomProvider } from "react-use-intercom";
import { Notifs } from "redux-notifications";
import { Provider } from "react-redux";

import * as Sentry from "@sentry/react";

import store from "./store";
import * as serviceWorker from "./serviceWorker";

// Actions
import { authLogin } from "actions/auth/creators";

// Components
import App, { serviceWorkerCallbacks } from "containers/App";

// Constants
import {
  GOOGLE_ANALYTICS_ID,
  HOTJAR_SNIPPET_VERSION,
  HOTJAR_TRACKING_ID,
  INTERCOM_APP_ID,
  SENTRY_DSN,
} from "./constants/env";

// Sentry
Sentry.init({
  dsn: SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

// Hotjar
hotjar.initialize(HOTJAR_TRACKING_ID, HOTJAR_SNIPPET_VERSION);

// Google Analytics
ReactGA.initialize(GOOGLE_ANALYTICS_ID, {
  debug: process.env.DEBUG || false,
  gaOptions: {
    siteSpeedSampleRate: 100,
  },
});

// Authentication
const token = localStorage.getItem("token");

if (token) {
  store.dispatch(authLogin(token));
}

ReactDOM.render(
  <Provider store={store}>
    <IntercomProvider appId={INTERCOM_APP_ID} autoBoot initializeDelay>
      <Router>
        <Notifs store={store} />
        <App />
      </Router>
    </IntercomProvider>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.register({
  immediate: true,
  onUpdate: (registration) => {
    serviceWorkerCallbacks.onUpdate(registration);
  },
});

// Expose store when run in Cypress
if (window.Cypress) {
  window.store = store;
}
