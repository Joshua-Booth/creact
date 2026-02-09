/** @public */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
}

/** @public */
export interface LoginCredentials {
  email: string;
  password: string;
}

/** @public */
export interface AuthResponse {
  key: string;
}
