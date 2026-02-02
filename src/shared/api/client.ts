import ky from "ky";

export class ApiError extends Error {
  status: number;
  response: unknown;
  constructor(message: string, status: number, response?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.response = response;
  }
}

export const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_ROOT_URL ?? "",
  timeout: 30000,
  retry: { limit: 2, methods: ["get"], statusCodes: [408, 500, 502, 503, 504] },
  hooks: {
    beforeRequest: [
      (request) => {
        const token = localStorage.getItem("token");
        if (token) request.headers.set("Authorization", `Token ${token}`);
      },
    ],
  },
});
