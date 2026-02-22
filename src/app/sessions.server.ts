import { createCookieSessionStorage } from "react-router";

import { createThemeSessionResolver } from "remix-themes";

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error(
      "SESSION_SECRET environment variable is required in production"
    );
  }
  if (!secret) {
    console.warn(
      "[sessions] Using default session secret. Set SESSION_SECRET for secure sessions."
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
    secure: process.env.NODE_ENV === "production",
    secrets: [getSessionSecret()],
  },
});

export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
