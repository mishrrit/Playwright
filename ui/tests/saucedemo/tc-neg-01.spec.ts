import { test, expect } from "../../support/fixtures/base";
import { LoginPage } from "../../pages/saucedemo/LoginPage";

test("TC-NEG-01: negative inputs and long values", async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();

  await login.login("' OR '1'='1", "' OR '1'='1");
  const err1 = await login.getErrorText();
  expect(err1.length).toBeGreaterThan(0);
  await expect(page.locator('[data-test="error"]')).toBeVisible();

  const long = "a".repeat(2000);
  await login.goto();
  await login.login(long, long);
  const err2 = await login.getErrorText();
  expect(err2.length).toBeGreaterThan(0);
  await expect(page.locator('[data-test="error"]')).toBeVisible();
});
