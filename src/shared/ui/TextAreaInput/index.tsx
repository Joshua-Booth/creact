import React from "react";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface TextAreaInputProps {
  type: string;
  className?: string;
  name: string;
  id?: string;
  label?: string;
  register?: UseFormRegisterReturn;
  innerRef?: (name: string, validation?: object) => UseFormRegisterReturn;
  validation?: object;
  error?: FieldError;
  submitError?: string;
}

export default function TextAreaInput({
  type: _type,
  className,
  name,
  id,
  label,
  register,
  innerRef,
  validation,
  error,
  submitError,
  ...props
}: TextAreaInputProps) {
  const registerProps =
    register || (innerRef ? innerRef(name, validation) : {});

  return (
    <div className={className}>
      <label htmlFor={id}>{label}</label>
      <div>
        <textarea
          id={id}
          className="form-control mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          data-testid={id}
          {...registerProps}
          {...props}
        />
      </div>
      {error && (
        <div className="error-message rounded-md bg-red-100 border border-red-300 text-red-700 p-2 mt-1 mb-0">
          <small>{error.message}</small>
        </div>
      )}
      {submitError && (
        <div className="submit-error-message rounded-md bg-red-100 border border-red-300 text-red-700 p-2 mt-1 mb-0">
          <small>{submitError}</small>
        </div>
      )}
    </div>
  );
}
