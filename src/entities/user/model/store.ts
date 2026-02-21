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
  authenticated: storedToken !== null,
  login: (token) => {
    setAuthToken(token);
    set({ token, authenticated: true });
  },
  logout: () => {
    removeAuthToken();
    set({ token: null, authenticated: false });
  },
}));
