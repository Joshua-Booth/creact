import { withI18n } from "@/storybook/decorators/with-i18n";
import { withSWR } from "@/storybook/decorators/with-swr";
import preview from "@/storybook/preview";
import { http, HttpResponse } from "msw";
import { reactRouterParameters } from "storybook-addon-remix-react-router";
import { expect, waitFor } from "storybook/test";

import { useAuthStore } from "@/entities/user";

import { DashboardPage } from "./dashboard-page";

useAuthStore.getState().login("mock-token");

const mockUser = {
  id: "1",
  email: "john@example.com",
  firstName: "John",
  lastName: "Doe",
};

const meta = preview.meta({
  title: "pages/Dashboard",
  component: DashboardPage,
  tags: ["!autodocs"],
  decorators: [withSWR, withI18n],
  parameters: {
    layout: "fullscreen",
    reactRouter: reactRouterParameters({
      routing: { path: "/dashboard" },
    }),
  },
});

export const Default = meta.story({
  parameters: {
    msw: {
      handlers: [
        http.get("**/auth/user/", () => {
          return HttpResponse.json(mockUser);
        }),
      ],
    },
  },
});

Default.test("renders heading after user loads", async ({ canvas }) => {
  await waitFor(() =>
    expect(canvas.getByRole("heading")).toHaveTextContent("Welcome back, John")
  );
});

export const Loading = meta.story({
  parameters: {
    msw: {
      handlers: [
        http.get("**/auth/user/", () => {
          // eslint-disable-next-line @typescript-eslint/no-empty-function -- intentionally never resolves
          return new Promise<never>(() => {});
        }),
      ],
    },
  },
});

export const ErrorState = meta.story({
  name: "Error",
  parameters: {
    msw: {
      handlers: [
        http.get("**/auth/user/", () => {
          return HttpResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
          );
        }),
      ],
    },
  },
});

ErrorState.test(
  "renders error message after API failure",
  async ({ canvas }) => {
    await waitFor(() =>
      expect(
        canvas.getByText("Something went wrong loading your dashboard.")
      ).toBeVisible()
    );
  }
);
