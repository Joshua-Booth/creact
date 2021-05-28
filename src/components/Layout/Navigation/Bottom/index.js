import React from "react";
import PropTypes from "prop-types";
import { withRouter, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { FixedBottom } from "react-fixed-bottom";

// Constants
import { BOTTOM_LINKS, BOTTOM_PUBLIC_LINKS } from "constants/links";

// Selectors
import { isAuthenticated } from "selectors/auth";

// Styles
import "./styles.scss";

// Utilities
import { isInStandaloneMode, isiOS } from "utils/device";

/**
 * Component for displaying the bottom mobile navigation.
 *
 * @param {...object} props Component properties
 * @param {boolean} props.authenticated The authenticated state of the user
 * @example
 * return (
 *   <BottomNavigation />
 * )
 * @returns {React.Component} The bottom navigation component
 */
function BottomBar({ authenticated }) {
  const renderNavigation = () => (
    <nav className="bottom-nav navbar">{renderLinks()}</nav>
  );

  const renderLinks = () => {
    const links = authenticated ? BOTTOM_LINKS : BOTTOM_PUBLIC_LINKS;
    return links.map((link, index) => {
      return (
        <NavLink
          exact
          to={`/${link.path}`}
          key={index}
          className={`bottom-nav__link nav-link ${
            links.length < 3 ? "mx-auto" : ""
          }`}
          activeClassName="active-link"
          aria-label={`${link.label}`}
        >
          {link.icon}
          <span className="bottom-nav__link-label">{link.label}</span>
        </NavLink>
      );
    });
  };

  return (
    <>
      {isiOS() && !isInStandaloneMode() ? (
        <FixedBottom offset={0}>{renderNavigation()}</FixedBottom>
      ) : (
        renderNavigation()
      )}
    </>
  );
}

BottomBar.propTypes = {
  /** The authenticated state of the user. */
  authenticated: PropTypes.bool,
};

/**
 * Maps Redux store state to component props.
 *
 * @function
 * @param {object} state The current Redux store state
 * @returns {object} The relevant state as the required props for the component
 */
function mapStateToProps(state) {
  return {
    authenticated: isAuthenticated(state),
  };
}

export default withRouter(connect(mapStateToProps)(BottomBar));
