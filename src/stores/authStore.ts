import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username?: string;
}

interface AuthState {
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

const API_ROOT_URL = import.meta.env.VITE_API_ROOT_URL || "";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      loading: false,
      error: null,
      authenticated: false,
      login: (token) => {
        localStorage.setItem("token", token);
        set({ token, authenticated: true, error: null });
      },
      logout: () => {
        localStorage.removeItem("token");
        set({ token: null, user: null, authenticated: false, error: null });
      },
      fetchUser: async () => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("token");
          if (!token) return;

          const response = await fetch(`${API_ROOT_URL}auth/user/`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
          if (!response.ok) throw new Error("Failed to fetch user");
          const data = await response.json();
          set({ user: data, loading: false, error: null });
        } catch (error) {
          set({ loading: false, error: error as Error });
        }
      },
      setError: (error) => set({ error }),
    }),
    { name: "auth-storage" },
  ),
);
