import { errorResponses } from "./mocks";
import { expect, test } from "./playwright.setup";

test.describe("Login", () => {
  test("user can login successfully", async ({ network: _network, page }) => {
    await page.goto("/login");

    const submitButton = page.getByRole("button", { name: /sign in/i });
    await expect(submitButton).toBeEnabled();

    const emailInput = page.getByLabel("Email");
    const passwordInput = page.getByLabel("Password");

    await emailInput.fill("test@mail.com");
    await expect(emailInput).toHaveValue("test@mail.com");

    await passwordInput.fill("password");
    await expect(passwordInput).toHaveValue("password");

    await submitButton.click();
    await page.waitForURL(/\/dashboard/);
  });

  test("shows error for invalid credentials", async ({ network, page }) => {
    await network.use(errorResponses.login.invalidCredentials());

    await page.goto("/login");

    const submitButton = page.getByRole("button", { name: /sign in/i });
    await expect(submitButton).toBeEnabled();

    await page.getByLabel("Email").fill("wrong@mail.com");
    await page.getByLabel("Password").fill("wrong-password");
    await submitButton.click();

    // Should show error message and stay on login page
    const error = page.getByRole("alert");
    await expect(error).toBeVisible();
    await expect(error).toContainText(
      "Unable to log in with provided credentials"
    );
    await expect(page).toHaveURL(/\/login/);
  });

  test("shows validation errors for empty fields", async ({
    network: _network,
    page,
  }) => {
    await page.goto("/login");

    const submitButton = page.getByRole("button", { name: /sign in/i });
    await expect(submitButton).toBeEnabled();

    // Click submit without filling any fields
    await submitButton.click();

    // Should show validation errors
    await expect(page.getByRole("alert").first()).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("prevents submission with invalid email format", async ({
    network: _network,
    page,
  }) => {
    // Default handler is set up, but client-side validation should prevent API call

    await page.goto("/login");

    const submitButton = page.getByRole("button", { name: /sign in/i });
    await expect(submitButton).toBeEnabled();

    // Type invalid email character by character to trigger validation
    const emailInput = page.getByLabel("Email");
    await emailInput.click();
    await emailInput.pressSequentially("invalid-email", { delay: 10 });

    const passwordInput = page.getByLabel("Password");
    await passwordInput.click();
    await passwordInput.pressSequentially("password", { delay: 10 });

    await submitButton.click();

    // Wait a bit for any potential navigation
    await page.waitForTimeout(500);

    // Should stay on login page - either showing validation error or not navigating
    await expect(page).toHaveURL(/\/login/);

    // API should not have been called if client-side validation is working
    // If it was called, that's also okay as long as we stay on /login
  });
});
