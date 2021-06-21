/**
 * Error utilities.
 *
 * @file index.js
 * @module utils - Error
 * @author Joshua Booth
 * @see https://github.com/joshua-booth/creact
 */

// Constants
import { AppTypes } from "constants/actionTypes";

/**
 * Display all active error messages on the page.
 *
 * @function
 * @param {object} errorProp The current error from state
 * @example
 * showAllErrors(this.props.error);
 */
export function showAllErrors(errorProp) {
  const errors = document.getElementsByClassName("submit-error-message");

  if (errors && errorProp) {
    [...errors].forEach(function (error) {
      error.classList.add("block");
    });
  }
}

/**
 * Hide all active error messages on the page.
 *
 * @function
 * @example
 * hideAllErrors();
 */
export function hideAllErrors() {
  const errors = document.getElementsByClassName("submit-error-message");
  if (errors.length > 0) {
    [...errors].forEach(function (error) {
      error.classList.remove("block");
      error.classList.add("hidden");
    });
  }
}

/**
 * Reset the error state of the application.
 *
 * @function resetErrorState
 * @example
 * dispatch(resetErrorState()); // Function component usage
 * this.props.resetErrorState(); // Class component usage
 * @returns {Function} Dispatches action to remove error state
 */
export function resetErrorState() {
  return function (dispatch) {
    dispatch({
      type: AppTypes.REMOVE_ERROR,
    });
  };
}

/**
 * Check if the object is empty.
 *
 * @function isObjectEmpty
 * @param {object} obj The object to check
 * @example
 * isObjectEmpty({}) // returns true
 * @returns {boolean} If the object is empty or not
 */
export function isObjectEmpty(obj) {
  return Object.getOwnPropertyNames(obj).length === 0;
}
