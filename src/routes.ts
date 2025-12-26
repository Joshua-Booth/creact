import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("./views/Landing/index.tsx"),
  route("dashboard", "./views/Dashboard/index.tsx"),
  route("login", "./views/Login/index.tsx"),
  route("logout", "./views/Logout/index.tsx"),
] satisfies RouteConfig;
