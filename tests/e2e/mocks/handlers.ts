import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("**/auth/login/", () => {
    return HttpResponse.json({ key: "mock-token" }, { status: 200 });
  }),
  http.post("**/auth/signup/", () => {
    return HttpResponse.json({ key: "mock-token" }, { status: 201 });
  }),
  http.post("**/auth/logout/", () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.post("**/auth/password/reset/", () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.get("**/auth/user/", () => {
    return HttpResponse.json(
      {
        id: "1",
        email: "newuser@mail.com",
        firstName: "New",
        lastName: "User",
      },
      { status: 200 }
    );
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
    serverError: () =>
      http.post("**/auth/login/", () => {
        return HttpResponse.json(null, { status: 500 });
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
    serverError: () =>
      http.post("**/auth/signup/", () => {
        return HttpResponse.json(null, { status: 500 });
      }),
  },
  logout: {
    serverError: () =>
      http.post("**/auth/logout/", () => {
        return HttpResponse.json(null, { status: 500 });
      }),
  },
  forgotPassword: {
    serverError: () =>
      http.post("**/auth/password/reset/", () => {
        return HttpResponse.json(null, { status: 500 });
      }),
  },
  user: {
    serverError: () =>
      http.get("**/auth/user/", () => {
        return HttpResponse.json(null, { status: 500 });
      }),
  },
};
