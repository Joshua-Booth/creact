import React from "react";
import PropTypes from "prop-types";

import { useIntercom } from "react-use-intercom";

// Components
import BackButton from "./BackButton";
import ReloadButton from "./ReloadButton";

// Constants
import { SUPPORT_EMAIL } from "constants/urls";
import { HTTP_STATUS_CODES } from "constants/statusCodes";

/**
 * Render a full Error to the user.
 *
 * @param {object} error Error object and page title
 * @param {number} [error.status] Error status code
 * @param {object} error.response Error response object
 * @param {string} [error.title] Optional title to show above the error
 * @example
 * // JSX
 * <Error status={404} response={error.response} title={"Help"} />
 * @returns {React.Component} The error component
 */
function Error({ status, response, title }) {
  const { show } = useIntercom();
  const showChat = () => show();

  if (!status && !response) {
    return null;
  }

  let errorType,
    statusText = null;
  if (status >= 500) {
    errorType = "on our end";
  } else if (status >= 400) {
    errorType = "on your end";
  } else {
    errorType =
      `! The server received an unexpected status of '${status}'` +
      `and the message '${response.statusText}'`;
  }

  if (response && response.statusText) {
    statusText = response.statusText;
  } else {
    if (response && response.message && response.message.includes("Error")) {
      statusText = response.message;
    } else {
      statusText = `${HTTP_STATUS_CODES[status]}`;
    }
  }

  return (
    <>
      {title && (
        <h1 className="pb-5 text-center" data-hj-allow>
          {title}
        </h1>
      )}
      <div title="Error" className="page-box" data-testid="error" data-hj-allow>
        <span className="text-6xl" data-testid="status-code">
          {status}
        </span>
        <h1 id="status-text" className="pb-1" data-testid="status-text">
          {statusText}
        </h1>
        <h2 className="pb-5" data-testid="error-type">
          Oops! Something went wrong{errorType ? " " + errorType : ""}.
        </h2>
        <div className="mx-auto">
          <p className="mb-3">
            If you believe this is a mistake, you can contact support&nbsp;
            <a href="#" onClick={showChat} aria-label="contact chat">
              here
            </a>
            &nbsp;or email&nbsp;
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
          </p>
          <BackButton />
          <ReloadButton />
        </div>
      </div>
    </>
  );
}

/** @memberof Error */
Error.propTypes = {
  /** HTTP error status code. */
  status: PropTypes.number.isRequired,
  /** HTTP response object. */
  response: PropTypes.object.isRequired,
  /** Optional title of the page before the error. */
  title: PropTypes.string,
};

export default Error;
