import { createCookieSessionStorage } from "react-router";

import { createThemeSessionResolver } from "remix-themes";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__creact-theme",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["s3cr3t"], // TODO: use env variable in production
  },
});

export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
