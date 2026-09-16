import { test, expect } from "../../support/fixtures/base";
import { LoginPage } from "../../pages/demo-web-shop/LoginPage";

// spec: test-plans/01-demo-web-shop-catalog-and-validation.md
// seed: unavailable in this repository; follows existing @playwright/test conventions
test.describe("Demo Web Shop login validation", () => {
  test("Scenario 2.1: reject an empty login submission @regression", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();

    await loginPage.submit();

    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.welcomeHeading).toBeVisible();
  });
});
