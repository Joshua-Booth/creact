import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("./pages/landing/ui/index.tsx"),
  route("dashboard", "./pages/dashboard/ui/index.tsx"),
  route("login", "./pages/login/ui/index.tsx"),
  route("signup", "./pages/signup/ui/index.tsx"),
  route("logout", "./pages/logout/ui/index.tsx"),
] satisfies RouteConfig;
