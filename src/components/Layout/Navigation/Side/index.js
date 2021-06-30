import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

// Components
import Links from "./Links";

// Selectors
import { isAuthenticated } from "selectors/auth";

// Styles
import "./styles.scss";

/**
 * Component for displaying the sidebar navigation for desktop users.
 *
 * @param {...object} props Component properties
 * @param {boolean} props.authenticated The authenticated state of the user
 * @example
 * return (
 *   <SideNavigation />
 * )
 * @returns {React.Component} The sidebar navigation
 */
function SideNavigation({ authenticated }) {
  return (
    <>
      {authenticated && (
        <nav className="side-nav scroll-bar">
          <Links />
        </nav>
      )}
    </>
  );
}

SideNavigation.propTypes = {
  /** The authenticated state of the user. */
  authenticated: PropTypes.bool,
};

/**
 * Maps Redux store state to component props.
 *
 * @constant
 * @param {object} state The current Redux store state
 * @returns {object} The relevant state as the required props for the component
 */
const mapStateToProps = (state) => ({
  authenticated: isAuthenticated(state),
});

export default withRouter(connect(mapStateToProps)(SideNavigation));
