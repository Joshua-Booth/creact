/**
 * App action creators.
 *
 * @file creators.js
 * @module action creators - App
 * @author Joshua Booth
 * @see https://github.com/joshua-booth/creact
 */

// Constants
import { AppTypes } from "constants/actionTypes";

/**
 * Action creator for creating error actions.
 *
 * @param {object} error The error of the application
 * @returns {object} action The newly created action
 */
export const fetchError = (error) => ({
  type: AppTypes.ERROR,
  payload: error,
});
