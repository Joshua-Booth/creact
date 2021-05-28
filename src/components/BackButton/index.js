import React from "react";
import PropTypes from "prop-types";
import { AngleLeftIcon } from "react-line-awesome";

/**
 * Renders a back button.
 *
 * @param {...object} props Component properties
 * @param {string} props.label The text and aria label for the button
 * @param {object} [props.history] The app history for the back button to go back to
 * @param {string} [props.route] The route to redirect to (you must include '/')
 * @example
 * // JSX
 * <BackButton label={"Back"} history={history} />
 * @returns {React.Component} The back button component
 */
export default function BackButton({ label, history, route = null }) {
  let goBack = () => (history ? history.goBack() : window.history.back());
  if (route) {
    goBack = () =>
      history ? history.push(route) : window.history.pushState({}, "", route);
  }

  return (
    <div className="back-button mx-0 px-2 mx-sm-5 mx-md-0 mx-lg-4">
      <button className="button p-0" onClick={goBack} aria-label={label}>
        <AngleLeftIcon className="la-2x" />
        <span>{label}</span>
      </button>
    </div>
  );
}

/** @memberof BackButton */
BackButton.propTypes = {
  /* eslint-disable react/no-unused-prop-types */
  /** Back button label to display. */
  label: PropTypes.string.isRequired,
  /** Object containing the app's history state. */
  history: PropTypes.object,
  /** Route for redirecting the user to. */
  route: PropTypes.string,
};
