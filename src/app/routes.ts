import type { RouteConfig } from "@react-router/dev/routes";

import { index, route } from "@react-router/dev/routes";

export default [
  index("./routes/landing.tsx"),
  route("dashboard", "./routes/dashboard.tsx"),
  route("login", "./routes/login.tsx"),
  route("signup", "./routes/signup.tsx"),
  route("logout", "./routes/logout.tsx"),
  route("api/locales/:lng/:ns", "./routes/locales.ts"),
  route("*", "./routes/no-match.tsx"),
] satisfies RouteConfig;
