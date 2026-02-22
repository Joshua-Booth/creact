import ky from "ky";

import { getToken } from "./token-provider";

/**
 * Error thrown for API responses with non-2xx status codes.
 * Carries the HTTP status and optional parsed response body.
 */
export class ApiError extends Error {
  override readonly name = "ApiError" as const;
  /** HTTP status code from the failed response. */
  readonly status: number;
  /** Parsed response body, if available. */
  readonly response: unknown;
  constructor(message: string, status: number, response?: unknown) {
    super(message);
    this.status = status;
    this.response = response;
  }
}

/**
 * Pre-configured ky HTTP client with token injection, 30s timeout,
 * and retry logic for transient server errors.
 */
/* istanbul ignore start @preserve -- ky instance config: browser-only, tested transitively via E2E */
const apiRootUrl = import.meta.env.VITE_API_ROOT_URL ?? "";

if (apiRootUrl === "" && import.meta.env.PROD) {
  console.warn(
    "[API] VITE_API_ROOT_URL is not set. API requests will be relative to the page origin."
  );
}

export const api = ky.create({
  prefixUrl: apiRootUrl,
  timeout: 30000,
  retry: { limit: 2, methods: ["get"], statusCodes: [408, 500, 502, 503, 504] },
  hooks: {
    beforeRequest: [
      (request) => {
        const token = getToken();
        // eslint-disable-next-line security/detect-possible-timing-attacks -- False positive: checking existence, not comparing secrets
        if (token !== null)
          request.headers.set("Authorization", `Token ${token}`);
      },
    ],
  },
});
/* istanbul ignore end @preserve */
