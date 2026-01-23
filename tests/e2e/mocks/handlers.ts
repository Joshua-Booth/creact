export interface MockHandler {
  pattern: string;
  status: number;
  body: unknown;
}

export const handlers: MockHandler[] = [
  {
    pattern: "**/auth/login/",
    status: 200,
    body: { key: "mock-token" },
  },
  {
    pattern: "**/auth/signup/",
    status: 201,
    body: { key: "mock-token" },
  },
];

export const errorResponses = {
  login: {
    invalidCredentials: (): MockHandler => ({
      pattern: "**/auth/login/",
      status: 401,
      body: {
        non_field_errors: ["Unable to log in with provided credentials."],
      },
    }),
  },
  signup: {
    emailExists: (): MockHandler => ({
      pattern: "**/auth/signup/",
      status: 400,
      body: { email: ["A user with this email already exists."] },
    }),
  },
};
