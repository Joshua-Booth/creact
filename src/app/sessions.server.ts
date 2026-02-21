import { createCookieSessionStorage } from "react-router";

import { createThemeSessionResolver } from "remix-themes";

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error(
      "SESSION_SECRET environment variable is required in production"
    );
  }
  return secret ?? "dev-secret-change-in-production";
}

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__creact-theme",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: [getSessionSecret()],
  },
});

export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
