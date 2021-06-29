import React from "react";

// Constants
import { SOCIAL_LINKS } from "constants/links";

// Utilities
import { OutboundLink } from "utils/page";

/**
 * Component containing social links that will appear in the footer.
 *
 * @example
 * return (
 *   <SocialLinks />
 * )
 * @returns {React.Component} The social links component
 */
function SocialLinks() {
  return (
    <ul className="flex w-full justify-evenly m-auto mb-2 list-none no-bullet-style">
      {SOCIAL_LINKS.map((link, index) => (
        <li className="mb-[5px] pb-[10px]" key={index}>
          <OutboundLink
            className="footer-link font-bold no-underline text-dark-grey hover:text-primary first:text-2xl"
            to={link.path}
            eventLabel={`${link.label} - Footer Icon`}
            aria-label={link.label}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.icon}
          </OutboundLink>
        </li>
      ))}
    </ul>
  );
}

export default SocialLinks;
