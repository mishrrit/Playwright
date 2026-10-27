import { test, expect } from "../../support/fixtures/anonymous";
import { LoginPage } from "../../pages/saucedemo/LoginPage";
import { ProductsPage } from "../../pages/saucedemo/ProductsPage";
import { CartPage } from "../../pages/saucedemo/CartPage";
import { CheckoutPage } from "../../pages/saucedemo/CheckoutPage";
import { usersByKey as users } from "../../test-data/saucedemo/users";

test("TC-PERF-03: Checkout flow under slow conditions -> eventual success", async ({
  page,
}) => {
  const login = new LoginPage(page);
  const products = new ProductsPage(page);
  const checkout = new CheckoutPage(page);

  await login.goto();
  await login.login(users.perf.username, users.perf.password);
  await products.addByName(await products.productNameAt(0).innerText());
  const cart = new CartPage(page);
  await cart.gotoCart();
  await cart.proceedToCheckout();
  await checkout.fillInfo("Perf", "User", "99999");
  await checkout.finish();
  expect(await checkout.isComplete()).toBeTruthy();
});
