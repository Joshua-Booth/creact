import { useAuthStore } from "@/entities/user";
import { api, mutate } from "@/shared/api";
import { AUTH_URLS } from "@/shared/config";

/**
 * Invalidates the server-side token, clears local auth state, and purges the SWR cache.
 * Called as a clientLoader before the logout page renders.
 * @returns null after cleanup completes
 */
export async function logoutAction(): Promise<null> {
  try {
    await api.post(AUTH_URLS.LOGOUT);
  } catch {
    // Best-effort: ignore failures so logout always succeeds locally
  }
  useAuthStore.getState().logout();
  await mutate(() => true, undefined, { revalidate: false });
  return null;
}
