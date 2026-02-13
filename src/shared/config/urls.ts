/** Authentication endpoint paths (relative to API root). */
export const AUTH_URLS = {
  /** POST: Authenticate and receive a token. */
  LOGIN: "/auth/login/",
  /** POST: Invalidate the current token. */
  LOGOUT: "/auth/logout/",
  /** GET/PUT: Retrieve or update user profile. */
  USER_PROFILE: "/auth/user/",
  /** POST: Register a new user account. */
  SIGNUP: "/auth/signup/",
};

/**
 * Base URL constants for API and public asset endpoints.
 * @public
 */
export const API_URLS = {
  ROOT: import.meta.env.VITE_API_ROOT_URL,
  PUBLIC: import.meta.env.VITE_PUBLIC_URL,
};
