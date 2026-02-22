/** Authentication endpoint paths (relative to API root, without leading slash for ky). */
export const AUTH_URLS = {
  /** POST: Authenticate and receive a token. */
  LOGIN: "auth/login/",
  /** POST: Invalidate the current token. */
  LOGOUT: "auth/logout/",
  /** GET/PUT: Retrieve or update user profile. */
  USER_PROFILE: "auth/user/",
  /** POST: Register a new user account. */
  SIGNUP: "auth/signup/",
  /** POST: Request a password reset email. */
  FORGOT_PASSWORD: "auth/password/reset/",
};

/**
 * Base URL constants for API and public asset endpoints.
 * @public
 */
export const API_URLS = {
  ROOT: import.meta.env.VITE_API_ROOT_URL,
  PUBLIC: import.meta.env.VITE_PUBLIC_URL,
};
