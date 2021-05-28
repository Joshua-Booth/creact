/**
 * Action types for reducers.
 *
 * @file urls.js
 * @module constants - URLs
 * @author Joshua Booth
 * @see https://github.com/joshua-booth/creact
 */

/** API ROOT URL. */
export const ROOT_URL = process.env.REACT_APP_ROOT_URL;

/**
 * Authentication related URLs.
 *
 * @type {object}
 * @property {string} LOGIN Login URL
 * @property {string} SIGNUP Signup URL
 * @property {string} CHANGE_PASSWORD Change password URL
 * @property {string} RESET_PASSWORD Reset password URL
 * @property {string} RESET_PASSWORD_CONFIRM Reset password confirmation URL
 * @property {string} USER_ACTIVATION User account activation URL
 * @property {string} USER_PROFILE User profile URL
 */
export const AuthUrls = {
  LOGIN: `${ROOT_URL}/auth/login/`,
  SIGNUP: "https://website.com/signup/",
  CHANGE_PASSWORD: `${ROOT_URL}/auth/password/change/`,
  RESET_PASSWORD: `${ROOT_URL}/auth/password/reset/`,
  RESET_PASSWORD_CONFIRM: `${ROOT_URL}/auth/password/reset/confirm/`,
  USER_ACTIVATION: `${ROOT_URL}/auth/registration/verify-email/`,
  USER_PROFILE: `${ROOT_URL}/auth/user/`,
};

/**
 * Application related URLs.
 *
 * @type {object}
 * @property {string} PRIVACY_POLICY Privacy policy URL
 * @property {string} TERMS_OF_USE Terms of Use policy URL
 * @property {string} KNOWLEDGE_PAGE Knowledge page URL
 */
export const AppUrls = {
  PRIVACY_POLICY: `${ROOT_URL}/app/privacy_policy/`,
  TERMS_OF_USE: `${ROOT_URL}/app/terms_of_use/`,
  KNOWLEDGE_PAGE: `${ROOT_URL}/app/knowledge_page/`,
};

/** Site support email address. */
export const SUPPORT_EMAIL = "support@email.com";

/**
 * Social media URLs.
 *
 * @type {object}
 * @property {string} FACEBOOK Facebook URL
 * @property {string} TWITTER Twitter URL
 * @property {string} INSTAGRAM Instagram URL
 */
export const SocialUrls = {
  FACEBOOK: "https://www.facebook.com/",
  TWITTER: "https://twitter.com/",
  INSTAGRAM: "https://www.instagram.com/",
};
