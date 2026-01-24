/** @public */
export interface ApiResponse<T> {
  data: T;
}

/** @public */
export interface ApiError {
  status: number;
  message: string;
  response?: unknown;
}
