import { create } from "zustand";

import type { AuthState } from "./types";
import {
  getAuthToken,
  removeAuthToken,
  setAuthToken,
  TOKEN_KEY,
} from "../lib/token";

const storedToken = getAuthToken();

/**
 * Authentication state store managing user login/logout and token persistence.
 * Uses `localStorage["token"]` as the single source of truth for the auth token.
 */
export const useAuthStore = create<AuthState>()((set) => ({
  token: storedToken,
  login: (token) => {
    setAuthToken(token);
    set({ token });
  },
  logout: () => {
    removeAuthToken();
    set({ token: null });
  },
}));

// Sync auth state across browser tabs via storage events
if (typeof window !== "undefined") {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== TOKEN_KEY) return;
    const { token } = useAuthStore.getState();

    if (event.newValue === null && token !== null) {
      useAuthStore.setState({ token: null });
    } else if (event.newValue !== null && event.newValue !== token) {
      useAuthStore.setState({ token: event.newValue });
    }
  };

  window.addEventListener("storage", onStorage);

  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      window.removeEventListener("storage", onStorage);
    });
  }
}

/**
 * Whether the current session is authenticated (has a token).
 * @returns `true` when a session token is present, `false` otherwise.
 */
export const useAuthenticated = () =>
  useAuthStore((state) => state.token !== null);
