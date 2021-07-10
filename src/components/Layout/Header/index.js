import React from "react";
import PropTypes from "prop-types";

import { withRouter, NavLink } from "react-router-dom";
import { connect } from "react-redux";

// Assets
import { ReactComponent as Logo } from "assets/images/logo.svg";

// Components
import Links from "./Links";
import { CornerSearch } from "components/Search";

// Constants
import { HEADER_LINKS } from "constants/links";

// Selectors
import { isAuthenticated } from "selectors/auth";

// Styles
import "./styles.scss";

/**
 * Header component containing the logo and links to important site pages.
 *
 * @param {...object} props Component properties
 * @param {boolean} props.authenticated The authenticated state of the user
 * @example
 * return (
 *   <Header />
 * )
 * @returns {React.Component} The header component
 */
function Header({ authenticated }) {
  const logoLink = authenticated ? "/dashboard" : "/";

  return (
    <header className="header relative p-0 mb-4">
      <NavLink
        to={logoLink}
        className="logo-container absolute"
        aria-label="Home"
      >
        <Logo className="img-fluid logo" alt="React Frontend Logo" />
      </NavLink>

      {authenticated ? <CornerSearch /> : <Links links={HEADER_LINKS} />}
    </header>
  );
}

Header.propTypes = {
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

export default withRouter(connect(mapStateToProps)(Header));
