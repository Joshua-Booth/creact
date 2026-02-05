import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("**/auth/login/", () => {
    return HttpResponse.json({ key: "mock-token" }, { status: 200 });
  }),
  http.post("**/auth/signup/", () => {
    return HttpResponse.json({ key: "mock-token" }, { status: 201 });
  }),
];

export const errorResponses = {
  login: {
    invalidCredentials: () =>
      http.post("**/auth/login/", () => {
        return HttpResponse.json(
          { non_field_errors: ["Unable to log in with provided credentials."] },
          { status: 401 }
        );
      }),
  },
  signup: {
    emailExists: () =>
      http.post("**/auth/signup/", () => {
        return HttpResponse.json(
          { email: ["A user with this email already exists."] },
          { status: 400 }
        );
      }),
  },
};
