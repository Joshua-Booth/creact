import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import { PostHogProvider } from "@/components/PostHogProvider";

import { routes } from "./routes";

export const router = createBrowserRouter(routes);

export default function App() {
  return (
    <PostHogProvider>
      <RouterProvider router={router}>
        <Outlet />
      </RouterProvider>
    </PostHogProvider>
  );
}
