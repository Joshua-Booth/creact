import { errorResponses } from "./mocks";
import { expect, test, waitForHydration } from "./playwright.setup";

test.describe("Signup", () => {
  test("user can signup successfully", async ({ network: _network, page }) => {
    await page.goto("/signup");
    await waitForHydration(page);

    const emailInput = page.getByTestId("email");
    const passwordInput = page.getByTestId("password");
    const confirmPasswordInput = page.getByTestId("confirm-password");

    await emailInput.fill("newuser@mail.com");
    await expect(emailInput).toHaveValue("newuser@mail.com");

    await passwordInput.fill("Password123");
    await expect(passwordInput).toHaveValue("Password123");

    await confirmPasswordInput.fill("Password123");
    await expect(confirmPasswordInput).toHaveValue("Password123");

    await page.click('[data-testid="signup"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("shows error when email already exists", async ({ network, page }) => {
    await network.use(errorResponses.signup.emailExists());

    await page.goto("/signup");
    await waitForHydration(page);

    await page.fill('[data-testid="email"]', "existing@mail.com");
    await page.fill('[data-testid="password"]', "Password123");
    await page.fill('[data-testid="confirm-password"]', "Password123");
    await page.click('[data-testid="signup"]');

    // Should show error message and stay on signup page
    await expect(page.getByTestId("signup-error")).toBeVisible();
    await expect(page.getByTestId("signup-error")).toContainText(
      "A user with this email already exists"
    );
    await expect(page).toHaveURL(/\/signup/);
  });

  test("shows validation errors for empty fields", async ({
    network: _network,
    page,
  }) => {
    await page.goto("/signup");
    await waitForHydration(page);

    // Click submit without filling any fields
    await page.click('[data-testid="signup"]');

    // Should show validation errors
    await expect(page.getByRole("alert").first()).toBeVisible();
    await expect(page).toHaveURL(/\/signup/);
  });

  test("shows error when passwords do not match", async ({
    network: _network,
    page,
  }) => {
    await page.goto("/signup");
    await waitForHydration(page);

    await page.fill('[data-testid="email"]', "test@mail.com");
    await page.fill('[data-testid="password"]', "Password123");
    await page.fill('[data-testid="confirm-password"]', "DifferentPassword123");
    await page.click('[data-testid="signup"]');

    // Should show password mismatch error and stay on signup page
    await expect(page.getByRole("alert")).toContainText(
      "Passwords do not match"
    );
    await expect(page).toHaveURL(/\/signup/);
  });
});
