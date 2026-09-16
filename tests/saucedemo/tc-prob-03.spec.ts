import { test, expect } from "../../support/fixtures/base";
import { LoginPage } from "../../pages/saucedemo/login.page";
import { ProductsPage } from "../../pages/saucedemo/products.page";
import users from "../../test-data/saucedemo/saucedemo_users.json";

const standard = users.find((u: any) => u.key === "standard");
if (!standard) {
  throw new Error('Test data user "standard" was not found');
}

test("TC-PROB-03: Product detail pages assert identity via name and price", async ({
  page,
}) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(standard.username, standard.password);
  const firstItem = page.locator(".inventory_item").nth(0);
  const name = (
    await firstItem.locator(".inventory_item_name").innerText()
  ).trim();
  const price = (
    await firstItem.locator(".inventory_item_price").innerText()
  ).trim();
  await firstItem.locator(".inventory_item_name").click();
  const detailName = (
    await page.locator(".inventory_details_name").innerText()
  ).trim();
  const detailPrice = (
    await page.locator(".inventory_details_price").innerText()
  ).trim();
  expect(detailName).toBe(name);
  expect(detailPrice).toBe(price);
});
