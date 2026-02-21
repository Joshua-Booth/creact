import { create } from "zustand";

import type { AuthState } from "./types";

const storedToken =
  typeof window === "undefined" ? null : localStorage.getItem("token");

/**
 * Authentication state store managing user login/logout and token persistence.
 * Uses `localStorage["token"]` as the single source of truth for the auth token.
 */
export const useAuthStore = create<AuthState>()((set) => ({
  token: storedToken,
  authenticated: storedToken !== null,
  login: (token) => {
    localStorage.setItem("token", token);
    set({ token, authenticated: true });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, authenticated: false });
  },
}));
