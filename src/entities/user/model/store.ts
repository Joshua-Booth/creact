import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AuthState } from "./types";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      authenticated: false,
      login: (token) => {
        localStorage.setItem("token", token);
        set({ token, authenticated: true });
      },
      logout: () => {
        localStorage.removeItem("token");
        set({ token: null, authenticated: false });
      },
    }),
    { name: "auth-storage" }
  )
);
