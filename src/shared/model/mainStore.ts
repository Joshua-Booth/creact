import { create } from "zustand";

interface MainState {
  error: { status: number; response: unknown } | null;
  setError: (error: MainState["error"]) => void;
  clearError: () => void;
}

/**
 * Global error state store for handling application-wide errors.
 */
export const useMainStore = create<MainState>((set) => ({
  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
