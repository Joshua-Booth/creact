import { HTTPError } from "ky";
import { SWRConfig } from "swr";

import { useAuthStore } from "@/entities/user";
import { api, ApiError } from "@/shared/api";

function handleGlobalError(err: unknown) {
  if (err instanceof ApiError && err.status === 401) {
    useAuthStore.getState().logout();
    window.location.href = "/login";
  }
}

const fetcher = async <T,>(url: string): Promise<T> => {
  try {
    return await api.get(url).json<T>();
  } catch (error) {
    if (error instanceof HTTPError) {
      const body: unknown = await error.response
        .clone()
        .json()
        .catch(() => error.response.clone().text());
      const message =
        typeof body === "object" &&
        body !== null &&
        "message" in body &&
        typeof (body as Record<string, unknown>).message === "string"
          ? (body as Record<string, unknown>).message
          : `Request failed: ${error.response.status}`;
      throw new ApiError(message as string, error.response.status, body);
    }
    throw error;
  }
};

const swrConfig = {
  fetcher,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  onError: handleGlobalError,
  shouldRetryOnError: (err: unknown) =>
    !(err instanceof ApiError && [401, 403].includes(err.status)),
};

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return <SWRConfig value={swrConfig}>{children}</SWRConfig>;
}
