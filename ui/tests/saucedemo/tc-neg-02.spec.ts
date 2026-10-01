import { test, expect } from "../../support/fixtures/base";
import { LoginPage } from "../../pages/saucedemo/login.page";

test("TC-NEG-02: Long username/password inputs -> app handles without crashing", async ({
  page,
}) => {
  const login = new LoginPage(page);
  await login.goto();
  const long = "a".repeat(2000);
  await login.login(long, long);

  await expect(page).toHaveURL(/saucedemo\.com/);
  await expect(page.locator('[data-test="error"]')).toBeVisible();
  await expect(page.locator('[data-test="error"]')).not.toHaveText("");
});
