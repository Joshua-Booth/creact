/** Authenticated user profile returned from the API. */
export interface User {
  /** Unique identifier. */
  id: string;
  /** Primary email address. */
  email: string;
  /** Given name. */
  firstName: string;
  /** Family name. */
  lastName: string;
  /** Optional display handle. */
  username?: string;
}

/** Authentication state managed by the auth store. */
export interface AuthState {
  /** Current session token, or null when logged out. */
  token: string | null;
  /** Whether the user has an active session. */
  authenticated: boolean;
  /** Store the token and mark the session as active. */
  login: (token: string) => void;
  /** Clear the token and end the session. */
  logout: () => void;
}
