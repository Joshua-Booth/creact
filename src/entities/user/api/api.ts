import { api } from "@/shared/api";
import { AUTH_URLS } from "@/shared/config";

import type { User } from "../model/types";

/**
 * Fetch user profile from API.
 * @param token - Authentication token
 * @returns User profile data
 * @public
 */
export async function fetchUserFromApi(token: string): Promise<User> {
  return api
    .get(AUTH_URLS.USER_PROFILE.slice(1), {
      headers: { Authorization: `Token ${token}` },
    })
    .json<User>();
}
