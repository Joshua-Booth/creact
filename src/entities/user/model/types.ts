export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
}

export interface AuthState {
  token: string | null;
  authenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}
