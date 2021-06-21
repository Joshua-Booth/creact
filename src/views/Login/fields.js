import React from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";

// Components
import { Input } from "utils/render";

const emailValidation = {
  required: { value: true, message: "Your email is required" },
  pattern: {
    value: /^\S+@\S+$/i,
    message: "Email is invalid",
  },
};

const passwordValidation = {
  required: { value: true, message: "Your password is required" },
};

/**
 * Fields for the Login component.
 *
 * @param {...object} props Component properties
 * @param {Function} props.onFieldChange Event handler for field changes
 * @param {Function} props.register Registration function for form fields
 * @param {object} props.errors Errors with any fields
 * @param {string} props.submitError A form submission error
 * @returns {React.Component} Login fields for the login form
 */
function LoginFields({ onFieldChange, register, errors, submitError }) {
  return (
    <fieldset className="form-group">
      <Input
        id="email"
        className="pb-2"
        label="Email"
        type="email"
        autoComplete="email"
        onChange={onFieldChange}
        name="email"
        innerRef={register}
        validation={emailValidation}
        error={errors.email}
      />

      <Input
        id="password"
        className="pb-3"
        label="Password"
        type="password"
        autoComplete="current-password"
        onChange={onFieldChange}
        name="password"
        innerRef={register}
        validation={passwordValidation}
        error={errors.password}
        submitError={submitError}
      />

      <Link
        className="absolute mt-2"
        to="/reset_password"
        aria-label="Forgot Password"
      >
        Forgot Password?
      </Link>
      <button
        action="submit"
        type="submit"
        className="btn btn-primary absolute right-0"
        aria-label="Login"
        data-testid="login"
      >
        Login
      </button>
    </fieldset>
  );
}

LoginFields.propTypes = {
  /** Event handler for field changes. */
  onFieldChange: PropTypes.func,
  /** Registration function for form fields. */
  register: PropTypes.func.isRequired,
  /** Errors with any fields. */
  errors: PropTypes.object,
  /** A form submission error. */
  submitError: PropTypes.string,
};

export default LoginFields;
