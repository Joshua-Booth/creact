import React, { useState, useEffect } from "react";
import ReactGA from "react-ga";
import PropTypes from "prop-types";

import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { useIntercom } from "react-use-intercom";

// Components
import UpdateAlert from "components/UpdateAlert";
import Intercom from "components/Intercom"; // Can be removed if not using Intercom
import Router from "components/Router";
import { Header, Footer, Navigation } from "components/Layout";

// Selectors
import { getUser } from "selectors/auth";

// Utilities
import { isObjectEmpty } from "utils/error";

// eslint-disable-next-line prefer-const
export let serviceWorkerCallbacks = {
  onUpdate: function () {},
};

/**
 * App component, containing the page structure of every page.
 *
 * @param {...object} props Component properties
 * @param {object} props.history History object for Google Analytics tracking
 * @returns {React.Component} The app component
 */
const App = ({ history }) => {
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);
  const { boot, update, shutdown } = useIntercom();
  const user = useSelector(getUser);

  useEffect(() => {
    // Intercom update with the current user
    update({
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
    });

    if (isObjectEmpty(user)) {
      shutdown();
      boot({
        customLauncherSelector: "#intercom_launcher",
        hideDefaultLauncher: true,
      });
    }
  }, [user]);

  useEffect(() => {
    // Intercom setup
    boot({
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      customLauncherSelector: "#intercom_launcher",
      hideDefaultLauncher: true,
    });

    // Show app update modal
    serviceWorkerCallbacks.onUpdate = () => {
      setShowUpdateAlert(true);
    };

    history.listen(() => {
      // Google Analytics
      ReactGA.set({ page: window.location.pathname });
      ReactGA.pageview(window.location.pathname);
    });
  }, []);

  return (
    <div className="app-container">
      {showUpdateAlert && <UpdateAlert />}
      <Header />
      <Router />
      <Navigation />
      <Intercom />
      <Footer />
    </div>
  );
};

App.propTypes = {
  /** History object for Google Analytics to track user page views. */
  history: PropTypes.object.isRequired,
};

export default withRouter(App);
