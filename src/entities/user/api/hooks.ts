import { useAuthenticatedApi } from "@/shared/api";
import { AUTH_URLS } from "@/shared/config";

import type { User } from "../model/types";

/**
 * Hook to fetch and manage the current authenticated user.
 * @returns User data, loading state, error, and mutate function
 */
export function useCurrentUser() {
  const { data, error, isLoading, isValidating, mutate } =
    useAuthenticatedApi<User>(AUTH_URLS.USER_PROFILE.slice(1));
  return { user: data, error, isLoading, isValidating, mutate };
}
