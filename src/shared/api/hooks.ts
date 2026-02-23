import type { SWRConfiguration, SWRResponse } from "swr";
import useSWR from "swr";

import type { ApiError } from "./client";
import { getToken } from "./token-provider";

/* istanbul ignore start @preserve -- Thin SWR wrappers, tested transitively via component stories */

/**
 * SWR hook for API fetching.
 * @param endpoint - API endpoint path or null to skip fetching
 * @param options - SWR configuration options
 * @returns SWR response with data and error
 * @public
 */
export function useApi<T>(
  endpoint: string | null,
  options?: SWRConfiguration<T, ApiError>
): SWRResponse<T, ApiError> {
  return useSWR<T, ApiError>(endpoint, options);
}

/**
 * SWR hook for authenticated API fetching.
 * Only fetches when a token is present (via the configured token provider).
 * @param endpoint - API endpoint path or null to skip fetching
 * @param options - SWR configuration options
 * @returns SWR response with data and error
 */
export function useAuthenticatedApi<T>(
  endpoint: string | null,
  options?: SWRConfiguration<T, ApiError>
): SWRResponse<T, ApiError> {
  const token = getToken();
  return useSWR<T, ApiError>(token === null ? null : endpoint, options);
}

/* istanbul ignore end @preserve */

export { mutate } from "swr";
