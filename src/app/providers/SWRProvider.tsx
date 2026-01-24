import { HTTPError } from "ky";
import { SWRConfig } from "swr";
import { ApiError, api } from "@/shared/api";

const fetcher = async <T,>(url: string): Promise<T> => {
  try {
    return await api.get(url).json<T>();
  } catch (error) {
    if (error instanceof HTTPError) {
      const body = await error.response
        .clone()
        .json()
        .catch(() => error.response.clone().text());
      throw new ApiError(
        (body as { message?: string })?.message ||
          `Request failed: ${error.response.status}`,
        error.response.status,
        body
      );
    }
    throw error;
  }
};

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        shouldRetryOnError: (err) =>
          !(err instanceof ApiError && [401, 403].includes(err.status)),
      }}
    >
      {children}
    </SWRConfig>
  );
}
