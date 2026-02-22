import { create } from "zustand";

import type { AuthState } from "./types";
import { getAuthToken, removeAuthToken, setAuthToken } from "../lib/token";

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

/**
 * Whether the current session is authenticated (has a token).
 * @returns `true` when a session token is present, `false` otherwise.
 */
export const useAuthenticated = () =>
  useAuthStore((state) => state.token !== null);
