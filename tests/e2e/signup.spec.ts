import { errorResponses } from "./mocks";
import { expect, HYDRATION_TIMEOUT, test } from "./playwright.setup";

test.describe("Signup", () => {
  test("user can signup successfully", async ({ network: _network, page }) => {
    await page.goto("/signup");

    const submitButton = page.getByRole("button", {
      name: /create account/i,
    });
    await expect(submitButton).toBeEnabled({ timeout: HYDRATION_TIMEOUT });

    const emailInput = page.getByLabel("Email");
    const passwordInput = page.getByLabel("Password", { exact: true });
    const confirmPasswordInput = page.getByLabel("Confirm Password");

    await emailInput.fill("newuser@mail.com");
    await expect(emailInput).toHaveValue("newuser@mail.com");

    await passwordInput.fill("Password123");
    await expect(passwordInput).toHaveValue("Password123");

    await confirmPasswordInput.fill("Password123");
    await expect(confirmPasswordInput).toHaveValue("Password123");

    await submitButton.click();
    await page.waitForURL(/\/dashboard/);
  });

  test("shows error when email already exists", async ({ network, page }) => {
    await network.use(errorResponses.signup.emailExists());

    await page.goto("/signup");

    const submitButton = page.getByRole("button", {
      name: /create account/i,
    });
    await expect(submitButton).toBeEnabled({ timeout: HYDRATION_TIMEOUT });

    await page.getByLabel("Email").fill("existing@mail.com");
    await page.getByLabel("Password", { exact: true }).fill("Password123");
    await page.getByLabel("Confirm Password").fill("Password123");
    await submitButton.click();

    // Should show error message and stay on signup page
    const error = page.getByRole("alert");
    await expect(error).toBeVisible();
    await expect(error).toContainText("A user with this email already exists");
    await expect(page).toHaveURL(/\/signup/);
  });

  test("shows validation errors for empty fields", async ({
    network: _network,
    page,
  }) => {
    await page.goto("/signup");

    const submitButton = page.getByRole("button", {
      name: /create account/i,
    });
    await expect(submitButton).toBeEnabled({ timeout: HYDRATION_TIMEOUT });

    // Click submit without filling any fields
    await submitButton.click();

    // Should show validation errors
    await expect(page.getByRole("alert").first()).toBeVisible();
    await expect(page).toHaveURL(/\/signup/);
  });

  test("shows error when passwords do not match", async ({
    network: _network,
    page,
  }) => {
    await page.goto("/signup");

    const submitButton = page.getByRole("button", {
      name: /create account/i,
    });
    await expect(submitButton).toBeEnabled({ timeout: HYDRATION_TIMEOUT });

    await page.getByLabel("Email").fill("test@mail.com");
    await page.getByLabel("Password", { exact: true }).fill("Password123");
    await page.getByLabel("Confirm Password").fill("DifferentPassword123");
    await submitButton.click();

    // Should show password mismatch error and stay on signup page
    await expect(page.getByRole("alert")).toContainText(
      "Passwords do not match"
    );
    await expect(page).toHaveURL(/\/signup/);
  });
});
