import { test, expect } from "../../support/fixtures/base";
import { LoginPage } from "../../pages/saucedemo/LoginPage";
import users from "../../test-data/saucedemo/saucedemo_users.json";

const errUser = users.find((u: any) => u.username === "error_user")!;

test("TC-ERR-01: error_user - resilient error handling", async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(errUser.username, errUser.password);

  const isOnProductsPage = await page.locator(".inventory_list").isVisible();
  const hasError = await page.locator('[data-test="error"]').count();

  expect(isOnProductsPage || hasError > 0).toBeTruthy();
  if (isOnProductsPage) {
    await expect(page.locator(".inventory_list")).toBeVisible();
  } else {
    await expect(page.locator('[data-test="error"]')).not.toHaveText("");
  }
});
