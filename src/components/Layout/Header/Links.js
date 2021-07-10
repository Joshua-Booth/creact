import React from "react";
import PropTypes from "prop-types";

import { NavLink } from "react-router-dom";

/**
 * Component containing links that will appear in the header.
 *
 * @param {...object} props Component properties
 * @param {...object} props.links The link objects to render
 * @param {string} props.links.path The relative link path
 * @param {string} props.links.label The label to display for the link
 * @example
 * return (
 *   <Links links={HEADER_LINKS} />
 * )
 * @returns {React.Component} The links component
 */
function Links({ links }) {
  return (
    <ul className="header__links nav no-bullet-style">
      {links.map((link, index) => (
        <li key={index} className="p-2">
          <NavLink
            exact
            className="nav-link mx-auto"
            activeClassName="active-link"
            to={link.path}
            aria-label={link.label}
          >
            {link.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

Links.propTypes = {
  /** The label to display for the link */
  links: PropTypes.object.isRequired,
};

export default Links;
