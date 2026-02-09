import type { KeyedMutator, SWRConfiguration } from "swr";

import type { ApiError } from "@/shared/api";
import { useAuthenticatedApi } from "@/shared/api";
import { AUTH_URLS } from "@/shared/config";

import type { User } from "../model/types";

interface CurrentUserResult {
  user: User | undefined;
  error: ApiError | undefined;
  isLoading: boolean;
  isValidating: boolean;
  mutate: KeyedMutator<User>;
}

/**
 * Hook to fetch and manage the current authenticated user.
 * Pass `{ suspense: true }` for use with React Suspense boundaries.
 * @param options - SWR configuration overrides
 * @returns User data, loading state, error, and mutate function
 */
export function useCurrentUser(
  options?: SWRConfiguration<User, ApiError>
): CurrentUserResult {
  const { data, error, isLoading, isValidating, mutate } =
    useAuthenticatedApi<User>(AUTH_URLS.USER_PROFILE.slice(1), options);
  return { user: data, error, isLoading, isValidating, mutate };
}
