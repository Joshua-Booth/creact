import React from "react";

// Assets
import { RedoAltIcon } from "assets/icons";

/**
 * A button that reloads the page.
 *
 * @returns {React.Component} The refresh button component
 */
function ReloadButton() {
  const reload = () => window.location.reload(true);

  return (
    <button
      className="text-current border-0 bg-white p-1 pl-0 ml-5"
      onClick={reload}
      aria-label="Reload Page"
    >
      <RedoAltIcon className="la-2x mr-2" />
      <span className="inline-block align-top mt-0.5">Reload</span>
    </button>
  );
}

export default ReloadButton;
