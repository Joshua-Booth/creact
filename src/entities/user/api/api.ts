import { api } from "@/shared/api";
import { AUTH_URLS } from "@/shared/config";
import type { User } from "../model/types";

/** @public Available for direct API usage without hooks */
export async function fetchUserFromApi(token: string): Promise<User> {
  return api
    .get(AUTH_URLS.USER_PROFILE.slice(1), {
      headers: { Authorization: `Token ${token}` },
    })
    .json<User>();
}
