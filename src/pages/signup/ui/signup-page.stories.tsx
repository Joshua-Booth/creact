import { withI18n } from "@/storybook/decorators/with-i18n";
import preview from "@/storybook/preview";
import { reactRouterParameters } from "storybook-addon-remix-react-router";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { SignupPage } from "./signup-page";

const meta = preview.meta({
  title: "pages/Signup",
  component: SignupPage,
  tags: ["!autodocs"],
  decorators: [withI18n],
  parameters: {
    layout: "fullscreen",
    reactRouter: reactRouterParameters({
      routing: {
        path: "/signup",
        action: () => ({ success: false, error: "Registration failed" }),
      },
      location: { path: "/signup" },
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
        name: /create account/i,
      });
      await userEvent.click(submitButton);
    });

    await step("verify email validation error", async () => {
      await waitFor(async () => {
        const emailInput = canvas.getByTestId("email");
        await expect(emailInput).toHaveAttribute("aria-invalid", "true");
      });
    });
  }
);

Default.test(
  "when entering weak password, should show password validation error",
  async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("enter valid email", async () => {
      const emailInput = await canvas.findByTestId("email");
      await userEvent.type(emailInput, "user@example.com");
    });

    await step("enter weak password", async () => {
      const passwordInput = await canvas.findByTestId("password");
      await userEvent.type(passwordInput, "weak");
    });

    await step("confirm password and submit", async () => {
      const confirmInput = await canvas.findByTestId("confirm-password");
      await userEvent.type(confirmInput, "weak");
      const submitButton = await canvas.findByRole("button", {
        name: /create account/i,
      });
      await userEvent.click(submitButton);
    });

    await step("verify password validation error", async () => {
      await waitFor(async () => {
        const passwordInput = canvas.getByTestId("password");
        await expect(passwordInput).toHaveAttribute("aria-invalid", "true");
      });
    });
  }
);

Default.test(
  "when passwords do not match, should show confirmation error",
  async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("enter valid email", async () => {
      const emailInput = await canvas.findByTestId("email");
      await userEvent.type(emailInput, "user@example.com");
    });

    await step("enter strong password", async () => {
      const passwordInput = await canvas.findByTestId("password");
      await userEvent.type(passwordInput, "Password123");
    });

    await step("enter mismatched confirmation and submit", async () => {
      const confirmInput = await canvas.findByTestId("confirm-password");
      await userEvent.type(confirmInput, "Password456");
      const submitButton = await canvas.findByRole("button", {
        name: /create account/i,
      });
      await userEvent.click(submitButton);
    });

    await step("verify confirmation validation error", async () => {
      await waitFor(async () => {
        const confirmInput = canvas.getByTestId("confirm-password");
        await expect(confirmInput).toHaveAttribute("aria-invalid", "true");
      });
    });
  }
);

Default.test(
  "when entering valid registration data, should enable form submission",
  async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("enter valid email", async () => {
      const emailInput = await canvas.findByTestId("email");
      await userEvent.type(emailInput, "newuser@example.com");
    });

    await step("enter strong password", async () => {
      const passwordInput = await canvas.findByTestId("password");
      await userEvent.type(passwordInput, "StrongPass123");
    });

    await step("enter matching confirmation", async () => {
      const confirmInput = await canvas.findByTestId("confirm-password");
      await userEvent.type(confirmInput, "StrongPass123");
    });

    await step("submit form", async () => {
      const submitButton = await canvas.findByRole("button", {
        name: /create account/i,
      });
      await userEvent.click(submitButton);
    });

    await step("verify no validation errors on inputs", async () => {
      await waitFor(async () => {
        const emailInput = canvas.getByTestId("email");
        await expect(emailInput).not.toHaveAttribute("aria-invalid", "true");
      });
    });
  }
);
