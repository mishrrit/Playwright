import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/practice-test-automation/LoginPage";
import loginData from "../../test-data/practice-test-automation/login.json";

// spec: test-plans/practice-test-automation/login.md
test.describe("Practice Test Automation Login", () => {
  test("Validate successful login with valid credentials @smoke @critical", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await test.step("Navigate to the login page and verify the login controls", async () => {
      await loginPage.goto();
      await expect(loginPage.heading).toBeVisible();
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.submitButton).toBeVisible();
    });

    await test.step("Enter valid credentials and submit", async () => {
      await loginPage.login(
        loginData.positiveLogin.username,
        loginData.positiveLogin.password,
      );
    });

    await test.step("Verify successful login", async () => {
      await expect(page).toHaveURL(
        new RegExp(loginData.positiveLogin.successUrlPattern),
      );
      await expect(loginPage.successMessage).toBeVisible();
      await expect(loginPage.logoutLink).toBeVisible();
    });
  });
});
