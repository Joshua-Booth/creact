import React from "react";

import { withRouter } from "react-router-dom";

// Components
import Error from "components/Error";

// Utilities
import { setPageTitle } from "utils/page";

/**
 * Display page for pages that can't be found.
 *
 * @returns {React.Component} The no match (404) component
 */
function NoMatch() {
  setPageTitle("Not Found");

  return (
    <main className="content-container">
      <Error status={404} title={"Page Not Found"} />
    </main>
  );
}

export default withRouter(NoMatch);
