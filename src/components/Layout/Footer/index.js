import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

// Constants
import { SOCIAL_LINKS } from "constants/links";
import { SUPPORT_EMAIL } from "constants/urls";

// Selectors
import { getUser } from "selectors/auth";

// Styles
import "./styles.scss";

// Utilities
import { isObjectEmpty } from "utils/error";
import { OutboundLink } from "utils/page";

/**
 * Footer component containing links to important site pages and social media.
 *
 * @param {...object} props Component properties
 * @param {object} props.user The user object
 * @example
 * return (
 *   <Footer />
 * )
 * @returns {React.Component} The footer component
 */
function Footer({ user }) {
  const renderTextLinks = () => {
    const isUser = !isObjectEmpty(user);
    const contactType = isUser ? "Support" : "Contact";

    return (
      <div className="footer__links w-100 mb-5">
        <Link
          className="footer__item-link"
          to="/privacy"
          aria-label="Privacy Policy"
        >
          Privacy Policy
        </Link>

        <a
          className="footer__item-link text-decoration-none"
          href={`mailto:${SUPPORT_EMAIL}`}
          aria-label="Contact"
        >
          {contactType}
        </a>

        <Link
          className="footer__item-link"
          to="/terms-of-use"
          aria-label="Terms of Use"
        >
          Terms of Use
        </Link>
      </div>
    );
  };

  const renderSocialLinks = () => (
    <ul className="footer__social-links flex w-100 mb-2 list-unstyled no-bullet-style">
      {SOCIAL_LINKS.map((link, index) => (
        <li className="footer__social-item" key={index}>
          <OutboundLink
            className="footer__social-link font-weight-bold"
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

  const renderCopyright = () => {
    const currentYear = new Date().getFullYear();

    return (
      <span className="copyright d-block text-center mx-auto" data-hj-allow>
        &copy; All rights reserved Joshua Booth {currentYear}
      </span>
    );
  };

  return (
    <footer className="footer position-absolute mx-auto left right">
      <div className="footer-wrapper w-100">
        {renderSocialLinks()}
        {renderTextLinks()}
        {renderCopyright()}
      </div>
    </footer>
  );
}

Footer.propTypes = {
  /** An object containing all user information. */
  user: PropTypes.object,
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
    user: getUser(state),
  };
}

export default connect(mapStateToProps)(Footer);
