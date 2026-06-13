import ky from "ky";

import { env } from "@/shared/config";

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
 * Set the `Authorization` header to the bearer token when one is present.
 * @param headers - The outgoing request headers to mutate.
 * @param token - The auth token, or null when unauthenticated.
 */
export function applyAuthHeader(headers: Headers, token: string | null): void {
  // eslint-disable-next-line security/detect-possible-timing-attacks -- False positive: checking existence, not comparing secrets
  if (token !== null) headers.set("Authorization", `Token ${token}`);
}

/**
 * Pre-configured ky HTTP client with token injection, 30s timeout,
 * and retry logic for transient server errors.
 */
// Stryker disable all : ky instance config — declarative, browser-only, covered via E2E
/* istanbul ignore start @preserve -- ky instance config: browser-only, tested transitively via E2E */
export const api = ky.create({
  prefix: env.VITE_API_ROOT_URL ?? "",
  timeout: 30000,
  retry: { limit: 2, methods: ["get"], statusCodes: [408, 500, 502, 503, 504] },
  hooks: {
    beforeRequest: [
      ({ request }) => {
        applyAuthHeader(request.headers, getToken());
      },
    ],
  },
});
/* istanbul ignore end @preserve */
// Stryker restore all
