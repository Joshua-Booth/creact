import React from "react";

import { Link } from "react-router-dom";

// Constants
import { FOOTER_LINKS } from "constants/links";

/**
 * Component containing text links that will appear in the footer.
 *
 * @example
 * return (
 *   <TextLinks />
 * )
 * @returns {React.Component} The text links component
 */
function TextLinks() {
  const linkClasses =
    "footer-link no-underline text-dark-grey hover:text-primary";

  return (
    <ul className="flex flex-wrap justify-between bottom-0 w-full mb-5 text-xs no-bullet-style">
      {FOOTER_LINKS.map((link, index) => (
        <li key={index}>
          {link.type == "link" && (
            <Link
              className={linkClasses}
              to={link.value}
              aria-label={link.label}
            >
              {link.label}
            </Link>
          )}
          {link.type == "mail" && (
            <a
              className={linkClasses}
              href={`mailto:${link.value}`}
              aria-label={link.label}
            >
              {link.label}
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

export default TextLinks;
