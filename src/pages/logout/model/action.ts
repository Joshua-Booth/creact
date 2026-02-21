import { useAuthStore } from "@/entities/user";

/**
 * Clears the auth token from localStorage and resets the Zustand auth store.
 * Called as a clientLoader before the logout page renders.
 * @returns null
 */
export function logoutAction(): null {
  localStorage.removeItem("token");
  useAuthStore.getState().logout();
  return null;
}
