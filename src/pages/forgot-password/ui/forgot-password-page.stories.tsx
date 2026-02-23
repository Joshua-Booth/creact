import { withI18n } from "@/storybook/decorators/with-i18n";
import preview from "@/storybook/preview";
import { reactRouterParameters } from "storybook-addon-remix-react-router";
import { expect, userEvent, waitFor } from "storybook/test";

import { ForgotPasswordPage } from "./forgot-password-page";

const meta = preview.meta({
  title: "pages/ForgotPassword",
  component: ForgotPasswordPage,
  tags: ["!autodocs"],
  decorators: [withI18n],
  parameters: {
    layout: "fullscreen",
    reactRouter: reactRouterParameters({
      routing: {
        path: "/forgot-password",
        action: () => ({ success: true }),
      },
      location: { path: "/forgot-password" },
    }),
  },
});

// --- Stories ---

export const Default = meta.story();

export const WithError = meta.story({
  parameters: {
    reactRouter: reactRouterParameters({
      routing: {
        path: "/forgot-password",
        action: () => ({
          success: false,
          error: "Something went wrong. Please try again later.",
        }),
      },
      location: { path: "/forgot-password" },
    }),
  },
});

// --- Tests ---

Default.test(
  "when submitting empty form, should show validation error",
  async ({ canvas, step }) => {
    await step("submit empty form", async () => {
      const submitButton = await canvas.findByRole("button", {
        name: /send reset link/i,
      });
      await userEvent.click(submitButton);
    });

    await step("verify email validation error", async () => {
      await waitFor(async () => {
        const emailInput = canvas.getByLabelText("Email");
        await expect(emailInput).toHaveAttribute("aria-invalid", "true");
      });
    });
  }
);

Default.test(
  "when entering valid email, should show success state",
  async ({ canvas, step }) => {
    await step("enter valid email", async () => {
      const emailInput = await canvas.findByLabelText("Email");
      await userEvent.type(emailInput, "user@example.com");
    });

    await step("submit form", async () => {
      const submitButton = await canvas.findByRole("button", {
        name: /send reset link/i,
      });
      await userEvent.click(submitButton);
    });

    await step("verify success message", async () => {
      await waitFor(async () => {
        const heading = canvas.getByRole("heading", {
          name: /check your email/i,
        });
        await expect(heading).toBeInTheDocument();
      });
    });
  }
);

Default.test(
  "when entering invalid email, should show email validation error",
  async ({ canvas, step }) => {
    await step("enter invalid email", async () => {
      const emailInput = await canvas.findByLabelText("Email");
      await userEvent.type(emailInput, "invalid-email");
    });

    await step("submit form", async () => {
      const submitButton = await canvas.findByRole("button", {
        name: /send reset link/i,
      });
      await userEvent.click(submitButton);
    });

    await step("verify email validation error", async () => {
      await waitFor(async () => {
        const emailInput = canvas.getByLabelText("Email");
        await expect(emailInput).toHaveAttribute("aria-invalid", "true");
      });
    });
  }
);
