import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useIntercom } from "react-use-intercom";

// Actions
import { logoutUser } from "actions/auth";

// Utilities
import { setPageTitle, Event } from "utils/page";

/**
 * Component for logging out the user.
 *
 * @returns {React.Component} The logout component
 */
function Logout() {
  setPageTitle("Logout");

  const { boot, shutdown } = useIntercom();

  useEffect(() => {
    Event("LOGOUT", "Log the user out of their account", "useEffect");

    if (window.Intercom) {
      shutdown();
      boot({
        customLauncherSelector: "#intercom_launcher",
        hideDefaultLauncher: true,
      });
    }

    logoutUser();
  }, []);

  return (
    <main className="content-container">
      <h1 className="pb-1">Logged Out</h1>
      <h2 className="pb-5">You have been logged out.</h2>

      <Link
        className="btn btn-primary mt-5 mr-2 text-decoration-none"
        to="/login"
        aria-label="Login"
      >
        Login
      </Link>
    </main>
  );
}

export default Logout;
