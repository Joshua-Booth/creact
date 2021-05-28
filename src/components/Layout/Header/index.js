import React from "react";
import PropTypes from "prop-types";
import { withRouter, NavLink } from "react-router-dom";
import { connect } from "react-redux";

// Assets
import { ReactComponent as Logo } from "assets/images/logo.svg";

// Components
import { CornerSearch } from "components/Search";

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
  const renderLinks = () => {
    return (
      <ul className="header__links nav d-none d-md-block no-bullet-style">
        <li className="header__link-item nav-item" key="login">
          <NavLink
            exact
            className="nav-link mx-auto"
            to="/login"
            activeClassName="active-link"
            aria-label="Login"
          >
            Login
          </NavLink>
        </li>
      </ul>
    );
  };

  const logoLink = authenticated ? "/dashboard" : "/";
  return (
    <header className="header navbar navbar-expand-sm position-relative p-0 mb-4">
      <NavLink
        to={logoLink}
        className="navbar-brand position-absolute"
        aria-label="Home"
      >
        <Logo className="img-fluid logo" alt="React Frontend Logo" />
      </NavLink>

      {!authenticated && renderLinks()}

      {authenticated && <CornerSearch />}
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
