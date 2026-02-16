import ky from "ky";

/**
 * Error thrown for API responses with non-2xx status codes.
 * Carries the HTTP status and optional parsed response body.
 */
export class ApiError extends Error {
  /** HTTP status code from the failed response. */
  status: number;
  /** Parsed response body, if available. */
  response: unknown;
  constructor(message: string, status: number, response?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.response = response;
  }
}

/**
 * Pre-configured ky HTTP client with token injection, 30s timeout,
 * and retry logic for transient server errors.
 */
/* istanbul ignore start -- ky instance config: browser-only, tested transitively via E2E */
export const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_ROOT_URL ?? "",
  timeout: 30000,
  retry: { limit: 2, methods: ["get"], statusCodes: [408, 500, 502, 503, 504] },
  hooks: {
    beforeRequest: [
      (request) => {
        const token = localStorage.getItem("token");
        // eslint-disable-next-line security/detect-possible-timing-attacks -- False positive: checking existence, not comparing secrets
        if (token !== null)
          request.headers.set("Authorization", `Token ${token}`);
      },
    ],
  },
});
/* istanbul ignore end */
