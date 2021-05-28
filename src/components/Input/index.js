import React from "react";
import PropTypes from "prop-types";

/**
 * Renders an input for react hook form.
 *
 * @param {...object} props Component properties
 * @param {string} props.type Label for the field
 * @param {string} props.className Classes for the input container
 * @param {string} props.name Name for the field
 * @param {string} [props.id] Unique identifier for the field
 * @param {string} [props.label] Label for the field
 * @param {Function} props.innerRef Register method from form
 * @param {object} [props.validation] Field validation values
 * @param {object} [props.error] Any field errors
 * @param {object} [props.submitError] Any field error processed after submitting
 * @example
 * <Input name="name" label="Name" type="text" innerRef={register} />
 * @returns {React.Component} The input component
 */
export default function Input({
  type,
  className,
  name,
  id,
  label,
  innerRef,
  validation,
  error,
  submitError,
  ...props
}) {
  return (
    <div className={className}>
      <label htmlFor={id}>{label}</label>
      <div>
        <input
          id={id}
          type={type}
          className="form-control"
          data-testid={id}
          {...innerRef(name, validation)}
          {...props}
        />
      </div>
      {error && (
        <div className="error-message alert alert-danger p-2 mt-1 mb-0">
          <small>{error.message}</small>
        </div>
      )}
      {submitError && (
        <div className="submit-error-message alert alert-danger p-2 mt-1 mb-0">
          <small>{submitError}</small>
        </div>
      )}
    </div>
  );
}

/** @memberof Input */
Input.propTypes = {
  type: PropTypes.string.isRequired,
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  label: PropTypes.string,
  innerRef: PropTypes.func.isRequired,
  validation: PropTypes.object,
  error: PropTypes.object,
  submitError: PropTypes.string,
};
