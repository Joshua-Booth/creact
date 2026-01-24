import { useAuthenticatedApi } from "@/shared/api";
import { AUTH_URLS } from "@/shared/config";
import type { User } from "../model/types";

export function useCurrentUser() {
  const { data, error, isLoading, isValidating, mutate } =
    useAuthenticatedApi<User>(AUTH_URLS.USER_PROFILE.slice(1));
  return { user: data, error, isLoading, isValidating, mutate };
}
