import React from "react";
import PropTypes from "prop-types";
import { withRouter, NavLink } from "react-router-dom";
import { connect } from "react-redux";

// Constants
import { SIDE_LINKS } from "constants/links";

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
  const renderLinks = () => {
    return SIDE_LINKS.map((link, index) => {
      return (
        <li className="side-nav__link-item flex" key={index}>
          <NavLink
            to={`/${link.path}`}
            className="side-nav__link nav-link"
            activeClassName="active-link"
            aria-label={`${link.label}`}
          >
            {link.icon}
            <span className="side-nav__link-label">{link.label}</span>
          </NavLink>
        </li>
      );
    });
  };

  return (
    <>
      {authenticated && (
        <nav className="side-nav flex items-center justify-between flex-wrap scroll-bar py-0 pl-1 pr-0">
          <ul className="side-nav__links flex flex-col mb-0 pl-0 no-bullet-style ml-4">
            {renderLinks()}
          </ul>
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
