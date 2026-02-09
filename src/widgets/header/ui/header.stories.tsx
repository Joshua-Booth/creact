import type { Decorator } from "@storybook/react-vite";

import { withI18n } from "@/storybook/decorators/with-i18n";
import preview from "@/storybook/preview";
import { Theme, ThemeProvider } from "remix-themes";
import { expect, within } from "storybook/test";

import { useAuthStore } from "@/entities/user";

import { Header } from "./header";

const withTheme: Decorator = (Story) => (
  <ThemeProvider specifiedTheme={Theme.LIGHT} themeAction="/action/set-theme">
    <Story />
  </ThemeProvider>
);

const withUnauthenticated: Decorator = (Story) => {
  useAuthStore.setState({ token: null, authenticated: false });
  return <Story />;
};

const withAuthenticated: Decorator = (Story) => {
  useAuthStore.setState({ token: "mock-token", authenticated: true });
  return <Story />;
};

const meta = preview.meta({
  title: "widgets/Header",
  component: Header,
  tags: ["!autodocs"],
  decorators: [withTheme, withI18n],
  parameters: {
    layout: "fullscreen",
  },
});

export const Default = meta.story({
  decorators: [withUnauthenticated],
});

Default.test(
  "should show login and signup links when unauthenticated",
  async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Login")).toBeVisible();
    await expect(canvas.getByText("Sign Up")).toBeVisible();
    await expect(canvas.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/"
    );
  }
);

export const Authenticated = meta.story({
  decorators: [withAuthenticated],
});

Authenticated.test(
  "should hide login/signup links when authenticated",
  async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.queryByText("Login")).not.toBeInTheDocument();
    await expect(canvas.queryByText("Sign Up")).not.toBeInTheDocument();
    await expect(canvas.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/dashboard"
    );
  }
);
