import React from 'react'

interface TextAreaInputProps {
  type: string
  className?: string
  name: string
  id?: string
  label?: string
  innerRef: (name: string, validation?: any) => { name: string; [key: string]: any }
  validation?: any
  error?: any
  submitError?: string
}

export default function TextAreaInput({
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
}: TextAreaInputProps) {
  return (
    <div className={className}>
      <label htmlFor={id}>{label}</label>
      <div>
        <textarea
          id={id}
          className="form-control mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          data-testid={id}
          {...innerRef(name, validation)}
          {...props}
        />
      </div>
      {error && (
        <div className="error-message alert-error">
          <small>{error.message}</small>
        </div>
      )}
      {submitError && (
        <div className="submit-error-message alert-error">
          <small>{submitError}</small>
        </div>
      )}
    </div>
  )
}
