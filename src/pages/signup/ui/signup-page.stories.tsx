import { createMemoryRouter, RouterProvider } from "react-router";
import { I18nextProvider, initReactI18next } from "react-i18next";

import preview from "@/storybook/preview";
import i18n from "i18next";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { I18N_CONFIG, resources } from "../../../shared/i18n";
import { SignupPage } from "./signup-page";

// --- Helpers ---

void i18n.use(initReactI18next).init({
  lng: "en",
  resources,
  ...I18N_CONFIG,
});

// Router wrapper for stories
function RouterDecorator({ children }: { children: React.ReactNode }) {
  const router = createMemoryRouter(
    [
      {
        path: "/signup",
        element: children,
        action: () => ({ success: false, error: "Registration failed" }),
      },
      { path: "/login", element: <div>Login</div> },
    ],
    { initialEntries: ["/signup"] }
  );

  return <RouterProvider router={router} />;
}

const meta = preview.meta({
  title: "pages/Signup",
  component: SignupPage,
  decorators: [
    (Story) => (
      <I18nextProvider i18n={i18n}>
        <RouterDecorator>
          <Story />
        </RouterDecorator>
      </I18nextProvider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
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
