import type { Meta, StoryObj } from "@storybook/react-vite";

import { createMemoryRouter, RouterProvider } from "react-router";
import { I18nextProvider, initReactI18next } from "react-i18next";

import i18n from "i18next";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { I18N_CONFIG, resources } from "../../../shared/i18n";
import { LoginPage } from "./index";

// Initialize i18n for stories
i18n.use(initReactI18next).init({
  lng: "en",
  resources,
  ...I18N_CONFIG,
});

// Router wrapper for stories
function RouterDecorator({ children }: { children: React.ReactNode }) {
  const router = createMemoryRouter(
    [
      {
        path: "/login",
        element: children,
        action: async () => ({ success: false, error: "Invalid credentials" }),
      },
      { path: "/dashboard", element: <div>Dashboard</div> },
    ],
    { initialEntries: ["/login"] }
  );

  return <RouterProvider router={router} />;
}

const meta = {
  title: "pages/Login",
  component: LoginPage,
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
} satisfies Meta<typeof LoginPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ShouldShowValidationErrors: Story = {
  name: "when submitting empty form, should show validation errors",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("submit empty form", async () => {
      const submitButton = await canvas.findByRole("button", {
        name: /sign in/i,
      });
      await userEvent.click(submitButton);
    });

    await step("verify email validation error", async () => {
      await waitFor(() => {
        const emailInput = canvas.getByTestId("email");
        expect(emailInput).toHaveAttribute("aria-invalid", "true");
      });
    });
  },
};

export const ShouldAcceptValidInput: Story = {
  name: "when entering valid credentials, should enable form submission",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("enter valid email", async () => {
      const emailInput = await canvas.findByTestId("email");
      await userEvent.type(emailInput, "user@example.com");
    });

    await step("enter valid password", async () => {
      const passwordInput = await canvas.findByTestId("password");
      await userEvent.type(passwordInput, "Password123");
    });

    await step("submit form", async () => {
      const submitButton = await canvas.findByRole("button", {
        name: /sign in/i,
      });
      await userEvent.click(submitButton);
    });

    await step("verify no validation errors on inputs", async () => {
      await waitFor(() => {
        const emailInput = canvas.getByTestId("email");
        expect(emailInput).not.toHaveAttribute("aria-invalid", "true");
      });
    });
  },
};

export const ShouldShowInvalidEmailError: Story = {
  name: "when entering invalid email, should show email validation error",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("enter invalid email", async () => {
      const emailInput = await canvas.findByTestId("email");
      await userEvent.type(emailInput, "invalid-email");
    });

    await step("enter password and submit", async () => {
      const passwordInput = await canvas.findByTestId("password");
      await userEvent.type(passwordInput, "password");
      const submitButton = await canvas.findByRole("button", {
        name: /sign in/i,
      });
      await userEvent.click(submitButton);
    });

    await step("verify email validation error", async () => {
      await waitFor(() => {
        const emailInput = canvas.getByTestId("email");
        expect(emailInput).toHaveAttribute("aria-invalid", "true");
      });
    });
  },
};
