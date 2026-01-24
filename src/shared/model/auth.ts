/** @public */
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
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
