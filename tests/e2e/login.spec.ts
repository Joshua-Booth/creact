import { errorResponses } from "./mocks";
import { expect, HYDRATION_TIMEOUT, test } from "./playwright.setup";

test.describe("Login", () => {
  test("user can login successfully", async ({ network: _network, page }) => {
    await page.goto("/login");

    const submitButton = page.getByRole("button", { name: /sign in/i });
    await expect(submitButton).toBeEnabled({ timeout: HYDRATION_TIMEOUT });

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
    await expect(submitButton).toBeEnabled({ timeout: HYDRATION_TIMEOUT });

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
    await expect(submitButton).toBeEnabled({ timeout: HYDRATION_TIMEOUT });

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
    await expect(submitButton).toBeEnabled({ timeout: HYDRATION_TIMEOUT });

    // Type invalid email character by character to trigger validation
    const emailInput = page.getByLabel("Email");
    await emailInput.click();
    await emailInput.pressSequentially("invalid-email", { delay: 10 });

    const passwordInput = page.getByLabel("Password");
    await passwordInput.click();
    await passwordInput.pressSequentially("password", { delay: 10 });

    await submitButton.click();

    // Client-side validation should display an error and prevent navigation
    const validationError = page.getByRole("alert").first();
    await expect(validationError).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });
});
