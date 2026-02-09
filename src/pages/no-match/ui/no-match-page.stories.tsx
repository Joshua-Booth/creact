import { withI18n } from "@/storybook/decorators/with-i18n";
import preview from "@/storybook/preview";
import { reactRouterParameters } from "storybook-addon-remix-react-router";
import { expect, within } from "storybook/test";

import { NoMatchPage } from "./no-match-page";

const meta = preview.meta({
  title: "pages/NoMatch",
  component: NoMatchPage,
  tags: ["!autodocs"],
  decorators: [withI18n],
  parameters: {
    layout: "fullscreen",
    reactRouter: reactRouterParameters({
      routing: { path: "/404" },
    }),
  },
});

export const Default = meta.story();

Default.test(
  "should render 404 heading and description",
  async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(
      "404 - Page Not Found"
    );
    await expect(
      canvas.getByText("Sorry, the page you are looking for does not exist.")
    ).toBeVisible();
  }
);
