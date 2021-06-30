import React from "react";

import { NavLink } from "react-router-dom";

// Constants
import { SIDE_LINKS } from "constants/links";

/**
 * Component containing links that will appear in the side navigation.
 *
 * @example
 * return (
 *   <Links />
 * )
 * @returns {React.Component} The text links component
 */
function Links() {
  return (
    <ul className="flex flex-col bg-white mb-0 pl-0 no-bullet-style ml-4">
      {SIDE_LINKS.map((link, index) => (
        <li className="flex py-[20px] px-0" key={index}>
          <NavLink
            to={`/${link.path}`}
            className="nav-link"
            activeClassName="active-link"
            aria-label={`${link.label}`}
          >
            {link.icon}
            <span className="text-xs pl-[16px] relative top-[-15%]">
              {link.label}
            </span>
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export default Links;
