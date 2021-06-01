import React, { useCallback } from "react";

import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { useIntercom } from "react-use-intercom";
import { CommentsIcon } from "react-line-awesome";

// Selectors
import { getUser } from "selectors/auth";

// Styles
import "./styles.scss";

// Utilities
import { isObjectEmpty } from "utils/error";

/**
 * Component for displaying an Intercom chat button.
 *
 * @example
 * return (
 *   <Intercom />
 * )
 * @returns {React.Component} The Intercom component
 */
function Intercom() {
  const user = useSelector(getUser);

  const { show, update } = useIntercom();
  const handleNewMessages = useCallback(() => {
    if (!isObjectEmpty(user)) {
      show();
    }
  }, [update]);

  return (
    <div title="Intercom Live Chat" role="region" className="intercom">
      <button
        id="intercom_launcher"
        className="intercom-launcher"
        onClick={handleNewMessages}
        aria-label="Intercom Chat Button"
      >
        <CommentsIcon className="la-2x" />
      </button>
    </div>
  );
}

export default withRouter(Intercom);
