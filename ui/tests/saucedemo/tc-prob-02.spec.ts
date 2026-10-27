import { test, expect } from "../../support/fixtures/anonymous";
import { LoginPage } from "../../pages/saucedemo/LoginPage";
import { ProductsPage } from "../../pages/saucedemo/ProductsPage";
import { CartPage } from "../../pages/saucedemo/CartPage";
import { usersByKey as users } from "../../test-data/saucedemo/users";

test("TC-PROB-02: Add to cart -> verify correct item added by name", async ({
  page,
}) => {
  const login = new LoginPage(page);
  const products = new ProductsPage(page);
  await login.goto();
  await login.login(users.problem.username, users.problem.password);
  const name = (await products.productNameAt(0).innerText()).trim();
  await products.addByName(name);
  const cart = new CartPage(page);
  await cart.gotoCart();
  const inCart = await cart.productNames.first().innerText();
  expect(inCart.trim()).toBe(name);
});
