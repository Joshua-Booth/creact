import { api } from "@/shared/api/client";
import { AUTH_URLS } from "@/shared/config/urls";
import type { User } from "../model/types";

export async function fetchUserFromApi(token: string): Promise<User> {
  return api
    .get(AUTH_URLS.USER_PROFILE.slice(1), {
      headers: { Authorization: `Token ${token}` },
    })
    .json<User>();
}
