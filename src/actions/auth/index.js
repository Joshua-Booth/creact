/**
 * Authentication actions.
 *
 * @file index.js
 * @module actions - Authentication
 * @author Joshua Booth
 * @see https://github.com/joshua-booth/creact
 */

import axios from "axios";

// Actions
import { dispatchError } from "actions/app";

// Action Creators
import * as Action from "./creators";

// Constants
import { AuthUrls } from "constants/urls";

// Notifications
import * as Notify from "./notifications";

// Utilities
import { auth } from "utils/action";

import store from "store";

/**
 * Logs a user in.
 *
 * @param {...object} formValues The login details to log the user in with
 * @param {string} formValues.email The user's email address
 * @param {string} formValues.password The user's password
 * @example
 * // Logs a user in with the email "jane@mail.com" and their password.
 * const formValues = {
 *    email: `jane@mail.com`,
 *    password: "********"
 * };
 * loginUser(formValues);
 * @returns {Promise<boolean>} Axios post request
 */
export function loginUser(formValues) {
  const dispatch = store.dispatch;

  return axios
    .post(AuthUrls.LOGIN, formValues)
    .then((response) => {
      // If request is good, update state to indicate user is authenticated
      const token = response.data.key;
      dispatch(Action.authLogin(token));

      localStorage.setItem("token", token);
      return true;
    })
    .catch((error) => {
      dispatchError(dispatch, error);
      return false;
    });
}

/**
 * Logs a user out.
 *
 * @example
 * logoutUser();
 */
export function logoutUser() {
  const dispatch = store.dispatch;

  localStorage.removeItem("token");

  dispatch(Action.logoutUserSuccess);
}

/**
 * Gets the current user.
 *
 * @example
 * dispatch(fetchUserProfile()); // Function component usage
 * @example
 * this.props.fetchUserProfile(); // Class component usage
 * @returns {Function} The thunk for dispatching
 */
export function fetchUserProfile() {
  /**
   * Dispatches Redux actions
   *
   * @param {Function} dispatch The function for dispatching
   */
  return function (dispatch) {
    dispatch(Action.fetchUserProfileRequest);
    axios
      .get(AuthUrls.USER_PROFILE, {
        headers: auth(),
        params: { time: new Date().getTime() },
      })
      .then((response) => {
        dispatch(Action.fetchUserProfileSuccess(response.data));
      })
      .catch((error) => {
        dispatchError(dispatch, error);
        dispatch(Action.fetchUserProfileFailed(error));
      });
  };
}

/**
 * Update the user's profile.
 *
 * @param {...object} formValues The user's details
 * @param {string} formValues.username The user's username
 * @param {string} formValues.first_name The user's first_name
 * @param {string} formValues.last_name The user's last_name
 * @example
 * // Update the user with the following form values:
 * const formValues = {
 *    username: "jane_doe",
 *    first_name: "Jane",
 *    last_name: "Doe"
 * };
 * updateUserProfile(formValues);
 * @returns {Promise<boolean>} Axios post request
 */
export function updateUserProfile(formValues) {
  const dispatch = store.dispatch;

  return axios
    .patch(AuthUrls.USER_PROFILE, formValues, { headers: auth() })
    .then((response) => {
      dispatch(Action.fetchUserProfileSuccess(response.data));
      dispatch(Notify.updateProfileSuccess());
      return true;
    })
    .catch((error) => {
      dispatchError(dispatch, error);
      if (
        (error && error.response === undefined) ||
        (error.response && error.response.status !== 400)
      ) {
        dispatch(Notify.updateProfileUnavailable());
      }
      return false;
    });
}
