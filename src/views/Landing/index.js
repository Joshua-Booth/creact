import React from "react";

// Utilities
import { setPageTitle } from "utils/page";

/**
 * Landing page component.
 *
 * @returns {React.Component} The landing component
 */
function Landing() {
  setPageTitle();

  return (
    <main className="container h-100 mt-5">
      <section>
        <h1 className="landing-header display-3">React Frontend</h1>
        <h2 className="text-center">
          A project template for creating awesome React web apps.
        </h2>
      </section>
    </main>
  );
}

export default Landing;
