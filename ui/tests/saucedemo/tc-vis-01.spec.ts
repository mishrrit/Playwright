import { test, expect } from "../../support/fixtures/base";
import { LoginPage } from "../../pages/saucedemo/LoginPage";
import users from "../../test-data/saucedemo/saucedemo_users.json";

const vis = users.find((u: any) => u.key === "visual");

test("TC-VIS-01: visual_user - visual snapshot of Products page", async ({
  page,
}) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(vis!.username, vis!.password);

  await expect(page.locator(".inventory_list")).toBeVisible();
  await expect(page.locator(".inventory_item")).toHaveCount(6);
  await expect(page.locator(".inventory_item_name").first()).toBeVisible();
  await expect(page.locator(".shopping_cart_link")).toBeVisible();

  await page.screenshot({
    path: "test-results/saucedemo-visual-products.png",
    fullPage: true,
  });
});
