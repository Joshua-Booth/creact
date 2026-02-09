import { createMemoryRouter, RouterProvider } from "react-router";
import { I18nextProvider, initReactI18next } from "react-i18next";

import preview from "@/storybook/preview";
import i18n from "i18next";
import { http, HttpResponse } from "msw";
import { expect, waitFor, within } from "storybook/test";
import { SWRConfig } from "swr";

import { SWRProvider } from "@/app/providers/swr-provider";
import { I18N_CONFIG, resources } from "@/shared/i18n";

import { DashboardPage } from "./dashboard-page";

void i18n.use(initReactI18next).init({
  lng: "en",
  resources,
  ...I18N_CONFIG,
});

localStorage.setItem("token", "mock-token");

function RouterDecorator({ children }: { children: React.ReactNode }) {
  const router = createMemoryRouter(
    [{ path: "/dashboard", element: children }],
    { initialEntries: ["/dashboard"] }
  );
  return <RouterProvider router={router} />;
}

const mockUser = {
  id: "1",
  email: "john@example.com",
  first_name: "John",
  last_name: "Doe",
};

const meta = preview.meta({
  title: "pages/Dashboard",
  component: DashboardPage,
  decorators: [
    (Story) => (
      <I18nextProvider i18n={i18n}>
        <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
          <SWRProvider>
            <RouterDecorator>
              <Story />
            </RouterDecorator>
          </SWRProvider>
        </SWRConfig>
      </I18nextProvider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
});

export default meta;

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

Default.test("renders heading after user loads", async ({ canvasElement }) => {
  const canvas = within(canvasElement);
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
  async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(
        canvas.getByText("Something went wrong loading your dashboard.")
      ).toBeVisible()
    );
  }
);
