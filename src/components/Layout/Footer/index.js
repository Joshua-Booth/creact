import React from "react";

// Components
import Copyright from "./Copyright";
import SocialLinks from "./SocialLinks";
import TextLinks from "./TextLinks";

// Styles
import "./styles.scss";

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
function Footer() {
  return (
    <footer className="footer absolute mx-auto left-0 right-0">
      <div className="w-full flex flex-row flex-wrap m-auto text-center justify-evenly text-base pb-5">
        <SocialLinks />
        <TextLinks />
        <Copyright />
      </div>
    </footer>
  );
}

export default Footer;
