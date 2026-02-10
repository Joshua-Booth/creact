import { withI18n } from "@/storybook/decorators/with-i18n";
import preview from "@/storybook/preview";
import { reactRouterParameters } from "storybook-addon-remix-react-router";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { LoginPage } from "./login-page";

const meta = preview.meta({
  title: "pages/Login",
  component: LoginPage,
  tags: ["!autodocs"],
  decorators: [withI18n],
  parameters: {
    layout: "fullscreen",
    reactRouter: reactRouterParameters({
      routing: {
        path: "/login",
        action: () => ({ success: false, error: "Invalid credentials" }),
      },
      location: { path: "/login" },
    }),
  },
});

// --- Stories ---

export const Default = meta.story();

// --- Tests ---

Default.test(
  "when submitting empty form, should show validation errors",
  async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("submit empty form", async () => {
      const submitButton = await canvas.findByRole("button", {
        name: /sign in/i,
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
  "when entering valid credentials, should enable form submission",
  async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("enter valid email", async () => {
      const emailInput = await canvas.findByLabelText("Email");
      await userEvent.type(emailInput, "user@example.com");
    });

    await step("enter valid password", async () => {
      const passwordInput = await canvas.findByLabelText("Password");
      await userEvent.type(passwordInput, "Password123");
    });

    await step("submit form", async () => {
      const submitButton = await canvas.findByRole("button", {
        name: /sign in/i,
      });
      await userEvent.click(submitButton);
    });

    await step("verify no validation errors on inputs", async () => {
      await waitFor(async () => {
        const emailInput = canvas.getByLabelText("Email");
        await expect(emailInput).not.toHaveAttribute("aria-invalid", "true");
      });
    });
  }
);

Default.test(
  "when entering invalid email, should show email validation error",
  async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("enter invalid email", async () => {
      const emailInput = await canvas.findByLabelText("Email");
      await userEvent.type(emailInput, "invalid-email");
    });

    await step("enter password and submit", async () => {
      const passwordInput = await canvas.findByLabelText("Password");
      await userEvent.type(passwordInput, "password");
      const submitButton = await canvas.findByRole("button", {
        name: /sign in/i,
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
