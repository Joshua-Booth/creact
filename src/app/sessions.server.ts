import { createCookieSessionStorage } from "react-router";

import { createThemeSessionResolver } from "remix-themes";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__creact-theme",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET ?? "dev-secret-change-in-production"],
  },
});

export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
