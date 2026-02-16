import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("**/auth/login/", () => {
    return HttpResponse.json({ key: "mock-token" }, { status: 200 });
  }),
  http.post("**/auth/signup/", () => {
    return HttpResponse.json({ key: "mock-token" }, { status: 201 });
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
