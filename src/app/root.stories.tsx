import type { Decorator } from "@storybook/react-vite";

import { withI18n } from "@/storybook/decorators/with-i18n";
import preview from "@/storybook/preview";
import { Theme, ThemeProvider } from "remix-themes";
import { reactRouterParameters } from "storybook-addon-remix-react-router";
import { expect, within } from "storybook/test";

import { useAuthStore } from "@/entities/user";

import Root, { HydrateFallback } from "./root";

type RootProps = Parameters<typeof Root>[0];

const loaderData = {
  locale: "en",
  theme: Theme.LIGHT,
} as RootProps["loaderData"];

const withTheme: Decorator = (Story) => (
  <ThemeProvider specifiedTheme={Theme.LIGHT} themeAction="/action/set-theme">
    <Story />
  </ThemeProvider>
);

const withUnauthenticated: Decorator = (Story) => {
  useAuthStore.setState({ token: null, authenticated: false });
  return <Story />;
};

const meta = preview.meta({
  title: "app/Root",
  component: Root,
  tags: ["!autodocs"],
  decorators: [withTheme, withI18n],
  args: {
    loaderData,
    params: {} as RootProps["params"],
    matches: [] as unknown as RootProps["matches"],
  },
  parameters: {
    layout: "fullscreen",
  },
});

export const OnLandingPage = meta.story({
  decorators: [withUnauthenticated],
  render: (args) => <Root {...args} />,
  parameters: {
    reactRouter: reactRouterParameters({
      routing: { path: "/" },
      location: { path: "/" },
    }),
  },
});

OnLandingPage.test(
  "should render app container with Header on landing page",
  async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Login")).toBeVisible();
    await expect(canvas.getByText("Sign Up")).toBeVisible();
  }
);

export const OnAuthRoute = meta.story({
  render: (args) => <Root {...args} />,
  parameters: {
    reactRouter: reactRouterParameters({
      routing: { path: "/login" },
      location: { path: "/login" },
    }),
  },
});

OnAuthRoute.test(
  "should not render Header on auth routes",
  async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.queryByText("Login")).not.toBeInTheDocument();
    await expect(canvas.queryByText("Sign Up")).not.toBeInTheDocument();
  }
);

export const Fallback = meta.story({
  render: (_args) => <HydrateFallback />,
  parameters: {
    reactRouter: reactRouterParameters({
      routing: { path: "/" },
    }),
  },
});

Fallback.test(
  "should render loading spinner and text",
  async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("status")).toBeVisible();
    await expect(canvas.getAllByText("Loading...").length).toBeGreaterThan(0);
  }
);
