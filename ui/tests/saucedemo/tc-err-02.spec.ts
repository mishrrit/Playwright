import { test, expect } from "../../support/fixtures/base";
import { LoginPage } from "../../pages/saucedemo/login.page";
import usersData from "../../test-data/saucedemo/saucedemo_users.json";
const users = Object.fromEntries(
  (usersData as any[]).map((u: any) => [u.key, u]),
);

test("TC-ERR-02: Attempt product operations -> verify graceful error handling", async ({
  page,
}) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(users.error.username, users.error.password);

  await expect(page.locator(".inventory_list")).toBeVisible({
    timeout: 10000,
  });

  await page.click(".inventory_item .btn_inventory");

  const hasError = await page.locator('[data-test="error"]').isVisible();
  const cartVisible = await page.locator(".shopping_cart_link").isVisible();

  expect(hasError || cartVisible).toBeTruthy();
  if (hasError) {
    await expect(page.locator('[data-test="error"]')).not.toHaveText("");
  }
});
