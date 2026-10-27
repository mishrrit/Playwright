import { test, expect } from "../../support/fixtures/base";
import { ProductsPage } from "../../pages/saucedemo/ProductsPage";
import { CartPage } from "../../pages/saucedemo/CartPage";
import { CheckoutPage } from "../../pages/saucedemo/CheckoutPage";

test("TC-STD-03: Complete checkout -> order completion", async ({ page }) => {
  const products = new ProductsPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  await page.goto("/inventory.html");
  await products.addByName(await products.productNameAt(0).innerText());
  await cart.gotoCart();
  await cart.proceedToCheckout();
  await checkout.fillInfo("Test", "User", "12345");
  await checkout.finish();
  expect(await checkout.isComplete()).toBeTruthy();
});
