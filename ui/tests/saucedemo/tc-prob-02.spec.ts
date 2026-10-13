import { test, expect } from "../../support/fixtures/base";
import { LoginPage } from "../../pages/saucedemo/login.page";
import { ProductsPage } from "../../pages/saucedemo/products.page";
import { usersByKey as users } from "../../test-data/saucedemo/users";

test("TC-PROB-02: Add to cart -> verify correct item added by name", async ({
  page,
}) => {
  const login = new LoginPage(page);
  const products = new ProductsPage(page);
  await login.goto();
  await login.login(users.problem.username, users.problem.password);
  const name = (
    await page.locator(products.productNames).nth(0).innerText()
  ).trim();
  await products.addByName(name);
  await page.click(".shopping_cart_link");
  const inCart = await page
    .locator(".cart_item .inventory_item_name")
    .first()
    .innerText();
  expect(inCart.trim()).toBe(name);
});
