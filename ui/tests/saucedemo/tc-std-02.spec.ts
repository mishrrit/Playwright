import { test, expect } from "../../support/fixtures/base";
import { LoginPage } from "../../pages/saucedemo/login.page";
import { ProductsPage } from "../../pages/saucedemo/products.page";
import users from "../../test-data/saucedemo/saucedemo_users.json";

const standard = users.find((u: any) => u.key === "standard");
if (!standard) {
  throw new Error("Standard user not found");
}

test("TC-STD-02: Add multiple items to cart -> cart badge increments", async ({
  page,
}) => {
  const login = new LoginPage(page);
  const products = new ProductsPage(page);
  await login.goto();
  await login.login(standard.username, standard.password);
  await expect(page.locator(products.inventory)).toBeVisible();
  // Add first two items
  const first = await page.locator(products.productNames).nth(0).innerText();
  const second = await page.locator(products.productNames).nth(1).innerText();
  await products.addByName(first.trim());
  await products.addByName(second.trim());
  const count = await products.cartCount();
  expect(count).toBeGreaterThanOrEqual(2);
});
