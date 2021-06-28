import React from "react";

// Constants
import { COPYRIGHT_HOLDER } from "constants/app";

/**
 * Copyright component with the copyright holder and current year.
 *
 * @example
 * return (
 *   <Copyright />
 * )
 * @returns {React.Component} The footer component
 */
function Copyright() {
  const currentYear = new Date().getFullYear();

  return (
    <span
      className="font-thin text-grey text-xs block text-center mx-auto"
      data-hj-allow
    >
      &copy; All rights reserved {COPYRIGHT_HOLDER} {currentYear}
    </span>
  );
}

export default Copyright;
