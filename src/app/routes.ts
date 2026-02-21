import type { RouteConfig } from "@react-router/dev/routes";

import { index, layout, route } from "@react-router/dev/routes";

export default [
  route("action/set-theme", "./routes/action.set-theme.ts"),
  route("robots.txt", "./routes/robots[.]txt.ts"),
  route("sitemap.xml", "./routes/sitemap[.]xml.ts"),
  index("./routes/landing.tsx"),
  layout("./routes/protected-layout.tsx", [
    route("dashboard", "./routes/dashboard.tsx"),
  ]),
  route("login", "./routes/login.tsx"),
  route("signup", "./routes/signup.tsx"),
  route("logout", "./routes/logout.tsx"),
  route("api/locales/:lng/:ns", "./routes/locales.ts"),
  route("*", "./routes/no-match.tsx"),
] satisfies RouteConfig;
