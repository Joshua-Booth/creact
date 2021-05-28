import React from "react";
import PropTypes from "prop-types";

/**
 * Renders a redux-form textarea field.
 *
 * @param {...object} props Component properties
 * @param {string} props.name Name for the field
 * @param {string} props.className Classes for the input container
 * @param {string} [props.id] Unique identifier for the field
 * @param {string} [props.label] Label for the field
 * @param {object} props.innerRef Function for registering a field with the form
 * @param {object} [props.error] Any field errors
 * @param {object} [props.submitError] Any field error processed after submitting
 * @example
 * <TextAreaInput name="name" label="Name" innerRef={register} />
 * @returns {React.Component} The textarea input component
 */
export default function TextAreaInput({
  name,
  className,
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
        <textarea
          id={id}
          className="form-control"
          data-testid={id}
          {...innerRef(name, validation)}
          {...props}
        />
      </div>
      {error && (
        <div className="alert alert-danger p-1 mt-1">
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

/** @memberof TextAreaInput */
TextAreaInput.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  innerRef: PropTypes.func.isRequired,
  validation: PropTypes.object,
  error: PropTypes.object,
  submitError: PropTypes.string,
};
