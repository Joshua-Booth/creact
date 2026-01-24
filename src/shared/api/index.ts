export { api, ApiError } from "./client";
export { useApi, useAuthenticatedApi, mutate } from "./hooks";

/** @public */
export const auth = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Token ${token}` } : {};
};

/** @public */
export const apiRootUrl = () => import.meta.env.VITE_API_ROOT_URL;
/** @public */
export const publicUrl = () => import.meta.env.VITE_PUBLIC_URL;
