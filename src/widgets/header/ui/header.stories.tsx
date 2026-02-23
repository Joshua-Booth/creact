import {
  withAuthenticated,
  withUnauthenticated,
} from "@/storybook/decorators/with-auth";
import { withI18n } from "@/storybook/decorators/with-i18n";
import { withTheme } from "@/storybook/decorators/with-theme";
import preview from "@/storybook/preview";
import { expect } from "storybook/test";

import { Header } from "./header";

const meta = preview.meta({
  title: "widgets/Header",
  component: Header,
  tags: ["!autodocs"],
  decorators: [withTheme, withI18n],
  parameters: {
    layout: "fullscreen",
  },
});

// --- Stories ---

export const Default = meta.story({
  decorators: [withUnauthenticated],
});

export const Authenticated = meta.story({
  decorators: [withAuthenticated],
});

// --- Tests ---

Default.test(
  "should show login and signup links when unauthenticated",
  async ({ canvas }) => {
    await expect(canvas.getByText("Login")).toBeVisible();
    await expect(canvas.getByText("Sign Up")).toBeVisible();
    await expect(canvas.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/"
    );
  }
);

Authenticated.test(
  "should hide login/signup links when authenticated",
  async ({ canvas }) => {
    await expect(canvas.queryByText("Login")).not.toBeInTheDocument();
    await expect(canvas.queryByText("Sign Up")).not.toBeInTheDocument();
    await expect(canvas.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/dashboard"
    );
  }
);
