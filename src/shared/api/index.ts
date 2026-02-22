import { getToken } from "./token-provider";

export { api, ApiError } from "./client";
export { mutate, useApi, useAuthenticatedApi } from "./hooks";
export { configureTokenProvider } from "./token-provider";

/**
 * Get auth headers from the configured token provider.
 * @returns Authorization header object or empty object
 * @public
 */
export const auth = () => {
  const token = getToken();
  return token === null ? {} : { Authorization: `Token ${token}` };
};
