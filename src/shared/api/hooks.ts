import useSWR from "swr";
import type { SWRConfiguration, SWRResponse } from "swr";
import type { ApiError } from "./client";

export function useApi<T>(
  endpoint: string | null,
  options?: SWRConfiguration<T, ApiError>
): SWRResponse<T, ApiError> {
  return useSWR<T, ApiError>(endpoint, options);
}

export function useAuthenticatedApi<T>(
  endpoint: string | null,
  options?: SWRConfiguration<T, ApiError>
): SWRResponse<T, ApiError> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return useSWR<T, ApiError>(token ? endpoint : null, options);
}

export { mutate } from "swr";
