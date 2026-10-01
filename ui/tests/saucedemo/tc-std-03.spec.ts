import { test, expect } from "../../support/fixtures/base";
import { LoginPage } from "../../pages/saucedemo/login.page";
import { ProductsPage } from "../../pages/saucedemo/products.page";
import { CartPage } from "../../pages/saucedemo/cart.page";
import { CheckoutPage } from "../../pages/saucedemo/checkout.page";
import users from "../../test-data/saucedemo/saucedemo_users.json";

const standard = users.find((u: any) => u.key === "standard")!;

test("TC-STD-03: Complete checkout -> order completion", async ({ page }) => {
  const login = new LoginPage(page);
  const products = new ProductsPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  await login.goto();
  await login.login(standard.username, standard.password);
  await products.addByName(
    await page.locator(products.productNames).nth(0).innerText(),
  );
  await page.click(".shopping_cart_link");
  await cart.proceedToCheckout();
  await checkout.fillInfo("Test", "User", "12345");
  await checkout.finish();
  expect(await checkout.isComplete()).toBeTruthy();
});
