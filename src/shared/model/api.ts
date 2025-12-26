export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  status: number;
  message: string;
  response?: unknown;
}
