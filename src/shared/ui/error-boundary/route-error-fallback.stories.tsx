import { I18nextProvider } from "react-i18next";

import { withI18n } from "@/storybook/decorators/with-i18n";
import preview from "@/storybook/preview";
import i18n from "i18next";
import { reactRouterParameters } from "storybook-addon-remix-react-router";
import { expect, within } from "storybook/test";

import { RouteErrorFallback } from "./route-error-fallback";

/**
 * Route-level error fallback displayed within the existing page layout
 * when a React Router loader/action throws.
 */
const meta = preview.meta({
  title: "ui/RouteErrorFallback",
  component: RouteErrorFallback,
  tags: ["!autodocs"],
  decorators: [withI18n],
});

/**
 * Displays when a route throws a standard Response (e.g. 500 from a loader).
 * Shows the HTTP status code and status text.
 */
export const RouteErrorResponse = meta.story({
  parameters: {
    reactRouter: reactRouterParameters({
      routing: {
        id: "error-route",
        path: "/error",
        errorElement: (
          <I18nextProvider i18n={i18n}>
            <RouteErrorFallback />
          </I18nextProvider>
        ),
      },
      hydrationData: {
        errors: {
          "error-route": {
            status: 500,
            statusText: "Internal Server Error",
            data: "",
            internal: true,
          },
        },
      },
    }),
  },
});

RouteErrorResponse.test(
  "should render HTTP status and status text",
  async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("500: Internal Server Error")).toBeVisible();
    await expect(
      canvas.getByRole("link", { name: /go home/i })
    ).toHaveAttribute("href", "/");
  }
);

/**
 * Displays when a route throws a non-Response error (e.g. an unhandled
 * exception in a loader). Shows a generic "Something went wrong" message.
 */
export const UnexpectedError = meta.story({
  parameters: {
    reactRouter: reactRouterParameters({
      routing: {
        id: "error-route",
        path: "/error",
        errorElement: (
          <I18nextProvider i18n={i18n}>
            <RouteErrorFallback />
          </I18nextProvider>
        ),
      },
      hydrationData: {
        errors: {
          "error-route": new Error("Unexpected failure"),
        },
      },
    }),
  },
});

UnexpectedError.test(
  "should render generic error message",
  async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Something went wrong")).toBeVisible();
    await expect(
      canvas.getByText(
        "An unexpected error occurred. Please try navigating back home."
      )
    ).toBeVisible();
    await expect(canvas.getByRole("link", { name: /go home/i })).toBeVisible();
  }
);

/**
 * Displays a 404 Not Found route error response.
 */
export const NotFoundError = meta.story({
  parameters: {
    reactRouter: reactRouterParameters({
      routing: {
        id: "error-route",
        path: "/error",
        errorElement: (
          <I18nextProvider i18n={i18n}>
            <RouteErrorFallback />
          </I18nextProvider>
        ),
      },
      hydrationData: {
        errors: {
          "error-route": {
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

NotFoundError.test("should render 404 status", async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  await expect(canvas.getByText("404: Not Found")).toBeVisible();
});
