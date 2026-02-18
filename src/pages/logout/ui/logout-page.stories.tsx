import { withI18n } from "@/storybook/decorators/with-i18n";
import preview from "@/storybook/preview";
import { reactRouterParameters } from "storybook-addon-remix-react-router";
import { expect, within } from "storybook/test";

import { LogoutPage } from "./logout-page";

const meta = preview.meta({
  title: "pages/Logout",
  component: LogoutPage,
  tags: ["!autodocs"],
  decorators: [withI18n],
  parameters: {
    layout: "fullscreen",
    reactRouter: reactRouterParameters({
      routing: { path: "/logout" },
    }),
  },
});

export const Default = meta.story();

Default.test(
  "should render signed out heading and description",
  async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(
      "You've been signed out"
    );
    await expect(
      canvas.getByText("You've been safely signed out of your account.")
    ).toBeVisible();
  }
);

Default.test("should render back to login link", async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const link = canvas.getByRole("link", { name: /back to login/i });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute("href", "/login");
});
