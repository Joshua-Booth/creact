import { createCookieSessionStorage } from "react-router";

import { createThemeSessionResolver } from "remix-themes";

import { env } from "@/shared/config";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__creact-theme",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    secrets: [env.SESSION_SECRET],
  },
});

export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
