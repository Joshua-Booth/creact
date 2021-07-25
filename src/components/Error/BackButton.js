import React from "react";

// Assets
import { AngleLeftIcon } from "assets/icons";

/**
 * A button that navigates back a page.
 *
 * @returns {React.Component} The back button component
 */
function BackButton() {
  const goBack = () => window.history.back();

  return (
    <button
      className="text-current border-0 bg-white p-1 px-2"
      onClick={goBack}
      aria-label="Go Back"
    >
      <AngleLeftIcon className="la-2x" />
      <span className="inline-block align-top mt-0.5">Back</span>
    </button>
  );
}

export default BackButton;
