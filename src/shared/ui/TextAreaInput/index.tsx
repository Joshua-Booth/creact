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
          className="form-control focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
          data-testid={id}
          {...registerProps}
          {...props}
        />
      </div>
      {error && (
        <div className="error-message mt-1 mb-0 rounded-md border border-red-300 bg-red-100 p-2 text-red-700">
          <small>{error.message}</small>
        </div>
      )}
      {submitError && (
        <div className="submit-error-message mt-1 mb-0 rounded-md border border-red-300 bg-red-100 p-2 text-red-700">
          <small>{submitError}</small>
        </div>
      )}
    </div>
  );
}
