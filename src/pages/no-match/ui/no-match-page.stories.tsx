import { I18nextProvider } from "react-i18next";

import { withI18n } from "@/storybook/decorators/with-i18n";
import preview from "@/storybook/preview";
import i18n from "i18next";
import { reactRouterParameters } from "storybook-addon-remix-react-router";
import { expect } from "storybook/test";

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

// --- Stories ---

export const Default = meta.story();

export const RouteError = meta.story({
  parameters: {
    reactRouter: reactRouterParameters({
      routing: {
        id: "no-match",
        path: "/404",
        errorElement: (
          <I18nextProvider i18n={i18n}>
            <NoMatchPage />
          </I18nextProvider>
        ),
      },
      hydrationData: {
        errors: {
          "no-match": {
            status: 404,
            statusText: "Not Found",
            data: "",
            internal: true,
          },
        },
      },
    }),
  },
});

// --- Tests ---

Default.test(
  "should render 404 heading and description",
  async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(
      "404 - Page Not Found"
    );
    await expect(
      canvas.getByText("Sorry, the page you are looking for does not exist.")
    ).toBeVisible();
  }
);

RouteError.test(
  "should render status and statusText for route error responses",
  async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(
      "404 - Page Not Found"
    );
    await expect(canvas.getByText("404: Not Found")).toBeVisible();
  }
);
