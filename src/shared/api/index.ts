export { api, ApiError } from "./client";
export { mutate, useApi, useAuthenticatedApi } from "./hooks";

/**
 * Get auth headers from localStorage token.
 * @returns Authorization header object or empty object
 * @public
 */
export const auth = () => {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  return token === null ? {} : { Authorization: `Token ${token}` };
};

/**
 * Get API root URL from environment.
 * @returns API root URL
 * @public
 */
export const apiRootUrl = () => import.meta.env.VITE_API_ROOT_URL;

/**
 * Get public URL from environment.
 * @returns Public URL
 * @public
 */
export const publicUrl = () => import.meta.env.VITE_PUBLIC_URL;
