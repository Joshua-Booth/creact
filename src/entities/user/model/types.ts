export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username?: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: Error | null;
  authenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
  setError: (error: Error | null) => void;
}
