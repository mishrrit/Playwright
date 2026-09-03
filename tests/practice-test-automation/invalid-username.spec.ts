import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/practice-test-automation/LoginPage";
import loginData from "../../test-data/practice-test-automation/login.json";

// spec: test-plans/practice-test-automation/login.md
test.describe("Practice Test Automation Login", () => {
  test("Reject an invalid username @smoke @regression", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await test.step("Navigate to the login page", async () => {
      await loginPage.goto();
    });

    await test.step("Enter an invalid username and submit", async () => {
      await loginPage.login(
        loginData.invalidUsername.username,
        loginData.invalidUsername.password,
      );
    });

    await test.step("Verify the username error and login page", async () => {
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toHaveText(
        loginData.invalidUsername.errorMessage,
      );
      await expect(page).toHaveURL(
        /practicetestautomation\.com\/practice-test-login\/$/,
      );
    });
  });
});
