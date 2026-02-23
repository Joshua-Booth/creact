import { withUnauthenticated } from "@/storybook/decorators/with-auth";
import { withI18n } from "@/storybook/decorators/with-i18n";
import { withTheme } from "@/storybook/decorators/with-theme";
import preview from "@/storybook/preview";
import { Theme } from "remix-themes";
import { reactRouterParameters } from "storybook-addon-remix-react-router";
import { expect } from "storybook/test";

import Root, { HydrateFallback } from "./root";

type RootProps = Parameters<typeof Root>[0];

const loaderData = {
  locale: "en",
  theme: Theme.LIGHT,
} as RootProps["loaderData"];

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

// --- Stories ---

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

export const OnAuthRoute = meta.story({
  render: (args) => <Root {...args} />,
  parameters: {
    reactRouter: reactRouterParameters({
      routing: { path: "/login" },
      location: { path: "/login" },
    }),
  },
});

export const Fallback = meta.story({
  render: (_args) => <HydrateFallback />,
  parameters: {
    reactRouter: reactRouterParameters({
      routing: { path: "/" },
    }),
  },
});

// --- Tests ---

OnLandingPage.test(
  "should render app container with Header on landing page",
  async ({ canvas }) => {
    await expect(canvas.getByText("Login")).toBeVisible();
    await expect(canvas.getByText("Sign Up")).toBeVisible();
  }
);

OnAuthRoute.test(
  "should not render Header on auth routes",
  async ({ canvas }) => {
    await expect(canvas.queryByText("Login")).not.toBeInTheDocument();
    await expect(canvas.queryByText("Sign Up")).not.toBeInTheDocument();
  }
);

Fallback.test("should render loading spinner and text", async ({ canvas }) => {
  await expect(canvas.getByRole("status")).toBeVisible();
  await expect(canvas.getAllByText("Loading...").length).toBeGreaterThan(0);
});
